import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderPages } from '../../components/header';
import { Search, Plus, Trash2, Filter, Download, ChevronUp, Building } from 'lucide-react';
import Modal from '../../components/modals';
import CreateService from '../../components/modals/CreateService';
import EditServiceModal from '../../components/modals/EditServiceModal';
import MoreServiceDetailsModal from '../../components/modals/MoreServiceDetailsModal';
import { 
  fetchServices, 
  deleteServices, 
  updateService 
} from '../../stores/redux/actions/serviceAction';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import ServiceList from '../../components/Service/ServiceList';

export const ServicePages = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector(state => state.services);
  const topRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [selectedService, setSelectedService] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [openModalCreateService, setOpenModalCreateService] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Console log để debug
  console.log("ServicePages loading state:", loading);
  console.log("ServicePages services:", services.length);

  // Fetch services when component mounts
  useEffect(() => {
    console.log("Dispatching fetchServices");
    dispatch(fetchServices());
  }, [dispatch]);
  
  // Handle scroll top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update filtered services when the original list or search term changes
  useEffect(() => {
    setFilteredServices(
      services.filter(service =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        service.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.companyId?.mst?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.features && service.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    );
  }, [services, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Open edit service modal
  const handleEditService = (service) => {
    setSelectedService(service);
    setEditModalOpen(true);
    setActiveDropdown(null);
  };

  // Save service changes
  const handleSaveService = async (updatedService) => {
    try {
      if (!updatedService._id) {
        console.error("Service missing ID in handleSaveService:", updatedService);
        toast.error("Lỗi: Không thể cập nhật dịch vụ không có ID");
        return;
      }
      
      await dispatch(updateService(updatedService));
      
      setFilteredServices(prevServices => 
        prevServices.map(s => s._id === updatedService._id ? {...s, ...updatedService} : s)
      );
      
      setEditModalOpen(false);
      toast.success("Cập nhật dịch vụ thành công");
    } catch (error) {
      console.error("Error in handleSaveService:", error);
      toast.error("Lỗi khi cập nhật dịch vụ: " + (error.message || "Đã xảy ra lỗi"));
    }
  };

  // Open more details modal
  const handleMoreOptions = (service) => {
    setSelectedService(service);
    setMoreModalOpen(true);
    setActiveDropdown(null);
  };

  // Handle select all services
  const handleSelectAllChange = () => {
    if (selectedServiceIds.length === filteredServices.length) {
      setSelectedServiceIds([]); // Unselect all
    } else {
      setSelectedServiceIds(filteredServices.map(service => service._id)); // Select all
    }
  };

  // Handle individual service selection
  const handleCheckboxChange = (serviceId) => {
    setSelectedServiceIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(serviceId)) {
        return prevSelectedIds.filter(id => id !== serviceId);
      } else {
        return [...prevSelectedIds, serviceId]; 
      }
    });
  };

  // Delete selected services
  const handleDeleteSelected = async () => {
    if (selectedServiceIds.length === 0) return;
    
    const confirmMessage = selectedServiceIds.length === 1 
      ? "Bạn có chắc chắn muốn xóa dịch vụ này?" 
      : `Bạn có chắc chắn muốn xóa ${selectedServiceIds.length} dịch vụ?`;
    
    const confirmation = window.confirm(confirmMessage);
    
    if (confirmation) {
      try {
        setIsDeleting(true);
        
        await dispatch(deleteServices(selectedServiceIds));
        
        setFilteredServices(prevServices => 
          prevServices.filter(service => !selectedServiceIds.includes(service._id))
        );
        
        setSelectedServiceIds([]);
        toast.success("Xóa dịch vụ thành công");
      } catch (error) {
        toast.error("Lỗi khi xóa dịch vụ: " + (error.message || "Đã xảy ra lỗi"));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle service created callback
  const handleServiceCreated = (newService) => {
    setFilteredServices([...services, newService]);
    setOpenModalCreateService(false);
    toast.success("Tạo dịch vụ thành công");
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Export to Excel
  const handleExportToExcel = () => {
    let dataToExport = filteredServices;
    
    if (selectedServiceIds.length > 0) {
      dataToExport = filteredServices.filter(service => 
        selectedServiceIds.includes(service._id)
      );
    }
    
    const exportData = dataToExport.map((service) => ({
      'Tên dịch vụ': service.name || '',
      'Loại dịch vụ': service.type || '',
      'Doanh nghiệp': service.companyId?.name || '',
      'MST': service.companyId?.mst || '',
      'Mô tả': service.description || '',
      'Giá dịch vụ (VNĐ)': service.price || 0,
      'Thời hạn (tháng)': service.duration || 0,
      'Trạng thái': service.status || '',
      'Tính năng': service.features ? service.features.join(', ') : '',
      'Người tạo': service.userCreated?.name || '',
      'Ngày cập nhật': service.lastModified ? new Date(service.lastModified).toLocaleDateString() : '',
      'Ngày tạo': service.createdAt ? new Date(service.createdAt).toLocaleDateString() : ''
    }));
    
    const workbook = XLSX.utils.book_new();
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dịch vụ');
    
    const date = new Date();
    const fileName = `danh_sach_dich_vu_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
    
    toast.success(`Đã xuất ${exportData.length} dịch vụ ra file Excel`);
  };

  // Show error toast when error exists
  useEffect(() => {
    if (error) {
      toast.error("Lỗi khi tải dữ liệu: " + error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      <HeaderPages title="Quản lý dịch vụ" />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-full">
        {/* Top Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, loại, mô tả, doanh nghiệp..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={() => setOpenModalCreateService(true)}
              >
                <Plus size={16} className="mr-1.5" />
                Thêm dịch vụ
              </button>
              
              {selectedServiceIds.length > 0 && (
                <button
                  className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-1.5" />
                      Xóa ({selectedServiceIds.length})
                    </>
                  )}
                </button>
              )}
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleExportToExcel}
              >
                <Download size={16} className="mr-1.5" />
                Xuất{selectedServiceIds.length > 0 ? ` (${selectedServiceIds.length})` : ''}
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Line */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            {filteredServices.length > 0 
              ? <span className="font-medium">Tổng <span className="text-blue-600 font-semibold">{filteredServices.length}</span> dịch vụ</span>
              : "Không tìm thấy dịch vụ nào"}
          </p>
        </div>

        {loading ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left w-12">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên dịch vụ
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại dịch vụ
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh nghiệp
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá dịch vụ
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời hạn
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày cập nhật
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tùy chọn
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                        <p>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <ServiceList
            filteredServices={filteredServices}
            loading={loading}
            searchTerm={searchTerm}
            activeDropdown={activeDropdown}
            selectedServiceIds={selectedServiceIds}
            toggleDropdown={toggleDropdown}
            handleCheckboxChange={handleCheckboxChange}
            handleSelectAllChange={handleSelectAllChange}
            handleEditService={handleEditService}
            handleMoreOptions={handleMoreOptions}
            setSearchTerm={setSearchTerm}
            setActiveDropdown={setActiveDropdown}
          />
        )}

        {/* Create Service Modal */}
        {openModalCreateService && (
          <CreateService
            closeModal={() => setOpenModalCreateService(false)}
            services={services}
            onServiceCreated={handleServiceCreated}
          />
        )}

        {/* Edit Service Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Chỉnh sửa thông tin dịch vụ"
        >
          <EditServiceModal
            service={selectedService}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveService}
          />
        </Modal>

        {/* More Details Modal */}
        <Modal
          isOpen={moreModalOpen}
          onClose={() => setMoreModalOpen(false)}
          title="Thông tin chi tiết dịch vụ"
        >
          <MoreServiceDetailsModal service={selectedService} />
        </Modal>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all z-50"
            aria-label="Lên đầu trang"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicePages;