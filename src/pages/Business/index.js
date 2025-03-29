import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderPages } from '../../components/header';
import { Search, Plus, Trash2, Filter, MoreVertical, Download, ChevronUp } from 'lucide-react';
import Modal from '../../components/modals';
import DropdownMenu from '../../components/DropdownMenu';
import EditBusinessModal from '../../components/modals/EditBusiness';
import MoreDetailsModalBusiness from '../../components/modals/MoreBusiness';
import CreateBusiness from '../../components/modals/CreateBusiness';
import { fetchBusinesses, deleteBusinesses } from '../../stores/redux/actions/businessActions';
import * as XLSX from 'xlsx'; // Import thư viện XLSX

export const BusinessPages = () => {
  const dispatch = useDispatch();
  const { businesses, loading, error } = useSelector(state => state.business);
  const topRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [openModalCreateBusiness, setOpenModalCreateBusiness] = useState(false);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);
  
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

  useEffect(() => {
    setFilteredBusinesses(
      businesses.filter(business =>
        business.mst?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [businesses, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleEditBusiness = (business) => {
    setSelectedBusiness(business);
    setEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveBusiness = (updatedBusiness) => {
    const updatedBusinesses = businesses.map(b =>
      b.id === updatedBusiness.id ? updatedBusiness : b
    );
    setFilteredBusinesses(updatedBusinesses);
    setEditModalOpen(false);
  };

  const handleMoreOptions = (business) => {
    setSelectedBusiness(business);
    setMoreModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSelectAllChange = () => {
    if (selectedBusinessIds.length === filteredBusinesses.length) {
      setSelectedBusinessIds([]); 
    } else {
      setSelectedBusinessIds(filteredBusinesses.map(business => business._id));
    }
  };

  const handleCheckboxChange = (businessId) => {
    setSelectedBusinessIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(businessId)) {
        return prevSelectedIds.filter(id => id !== businessId);
      } else {
        return [...prevSelectedIds, businessId]; 
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedBusinessIds.length > 0) {
      const confirmation = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedBusinessIds.length} doanh nghiệp?`);
      if (confirmation) {
        dispatch(deleteBusinesses(selectedBusinessIds)).then(() => {
          setFilteredBusinesses(filteredBusinesses.filter(business => !selectedBusinessIds.includes(business._id)));
          setSelectedBusinessIds([]);
        });
      }
    }
  };

  const handleBusinessCreated = (newBusiness) => {
    setFilteredBusinesses([...businesses, newBusiness]);
    setOpenModalCreateBusiness(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleExportToExcel = () => {
    let dataToExport = filteredBusinesses;
    
    if (selectedBusinessIds.length > 0) {
      dataToExport = filteredBusinesses.filter(business => 
        selectedBusinessIds.includes(business._id)
      );
    }
    
    const exportData = dataToExport.map((business) => ({
      'MST': business.mst || '',
      'Tên công ty': business.name || '',
      'Địa chỉ': business.address || '',
      'Tổng': business.totalTasks || 0,
      'Hoàn thành': business.completedTasks || 0, 
      'Đang làm': business.pendingTasks || 0,
      'Từ chối': business.rejectedTasks || 0,
      'Loại dữ liệu': business.dataTypes ? business.dataTypes.join(', ') : '',
      'Người lắp đặt': business.PInstaller || '',
      'Ngày cập nhật': business.lastModified ? new Date(business.lastModified).toLocaleDateString() : ''
    }));
    
    const workbook = XLSX.utils.book_new();
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh nghiệp');
    
    const date = new Date();
    const fileName = `danh_sach_doanh_nghiep_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      <HeaderPages title="Quản lý doanh nghiệp" />
      <div className="container mx-auto p-4 pb-6">
        {/* Top Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm doanh nghiệp..."
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
                onClick={() => setOpenModalCreateBusiness(true)}
              >
                <Plus size={16} className="mr-1.5" />
                Thêm doanh nghiệp
              </button>
              
              {selectedBusinessIds.length > 0 && (
                <button
                  className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 size={16} className="mr-1.5" />
                  Xóa ({selectedBusinessIds.length})
                </button>
              )}
              
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Filter size={16} className="mr-1.5" />
                Lọc
              </button>
              
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleExportToExcel}
              >
                <Download size={16} className="mr-1.5" />
                Xuất{selectedBusinessIds.length > 0 ? ` (${selectedBusinessIds.length})` : ''}
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Line */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            {filteredBusinesses.length > 0 
              ? <span className="font-medium">Tổng <span className="text-blue-600 font-semibold">{filteredBusinesses.length}</span> doanh nghiệp</span>
              : "Không tìm thấy doanh nghiệp nào"}
          </p>
        </div>

        {/* Business List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={handleSelectAllChange} 
                        checked={selectedBusinessIds.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b">MST</th>
                  <th className="p-3 border-b">Tên công ty</th>
                  <th className="p-3 border-b">Địa chỉ</th>
                  <th className="p-3 border-b">Tổng</th>
                  <th className="p-3 border-b">Hoàn thành</th>
                  <th className="p-3 border-b">Đang làm</th>
                  <th className="p-3 border-b">Từ chối</th>
                  <th className="p-3 border-b">Loại dữ liệu</th>
                  <th className="p-3 border-b">Người lắp đặt</th>
                  <th className="p-3 border-b">Ngày cập nhật</th>
                  <th className="p-3 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="p-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                        <p>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((business, index) => (
                    <tr key={business._id || index} className="hover:bg-gray-50 text-xs">
                      <td className="p-3 border-b">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedBusinessIds.includes(business._id)}
                          onChange={() => handleCheckboxChange(business._id)}
                        />
                      </td>
                      <td className="p-3 border-b font-medium text-gray-900">{business.mst}</td>
                      <td className="p-3 border-b">{business.name}</td>
                      <td className="p-3 border-b text-gray-500">{business.address}</td>
                      <td className="p-3 border-b">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                          {business.totalTasks}
                        </span>
                      </td>
                      <td className="p-3 border-b">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {business.completedTasks}
                        </span>
                      </td>
                      <td className="p-3 border-b">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                          {business.pendingTasks}
                        </span>
                      </td>
                      <td className="p-3 border-b">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {business.rejectedTasks}
                        </span>
                      </td>
                      <td className="p-3 border-b">
                        {business.dataTypes && business.dataTypes.length > 0 
                          ? business.dataTypes.join(', ')
                          : <span className="text-gray-400">-</span>
                        }
                      </td>
                      <td className="p-3 border-b">{business.PInstaller || <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 border-b">{business.lastModified ? new Date(business.lastModified).toLocaleDateString() : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 border-b text-right relative">
                        <div>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => toggleDropdown(index)}
                          >
                            <MoreVertical className="text-gray-500" size={16} />
                          </button>
                          <DropdownMenu
                            isOpen={activeDropdown === index}
                            onEdit={() => handleEditBusiness(business)}
                            onMore={() => handleMoreOptions(business)}
                            onClose={() => setActiveDropdown(null)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-3 py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-gray-500 mb-1">Không tìm thấy doanh nghiệp nào</p>
                        {searchTerm && (
                          <button
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={() => setSearchTerm("")}
                          >
                            Xóa tìm kiếm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openModalCreateBusiness && (
          <CreateBusiness
            closeModal={() => setOpenModalCreateBusiness(false)}
            businesses={businesses}
            onBusinessCreated={handleBusinessCreated}
          />
        )}

        {/* Edit Business Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Chỉnh sửa thông tin doanh nghiệp"
        >
          <EditBusinessModal
            business={selectedBusiness}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveBusiness}
          />
        </Modal>

        {/* More Details Modal */}
        <Modal
          isOpen={moreModalOpen}
          onClose={() => setMoreModalOpen(false)}
          title="Thông tin chi tiết"
        >
          <MoreDetailsModalBusiness business={selectedBusiness} />
        </Modal>

        {/* Nút cuộn lên đầu trang */}
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