import React, { useState, useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, MoreVertical, Plus } from 'lucide-react';
import { TaskData } from '../../stores/data/task.task';
import Modal from '../../components/modals';
import DropdownMenu from '../../components/DropdownMenu';
import EditBusinessModal from '../../components/modals/EditBusiness';
import MoreDetailsModalBusiness from '../../components/modals/MoreBusiness';
import CreateBusiness from '../../components/modals/CreateBusiness';

export const BusinessPages = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [openModalCreateBusiness, setOpenModalCreateBusiness] = useState(false);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState([]); 

  useEffect(() => {
    const extractBusinesses = () => {
      const businessMap = new Map();

      TaskData.forEach(task => {
        if (!businessMap.has(task.mst)) {
          businessMap.set(task.mst, {
            id: task.mst,
            mst: task.mst,
            name: task.name,
            address: task.address,
            contactPerson: task.userId?.name || 'N/A',
            PInstaller: task.PInstaller,
            phone: '',
            email: '',
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            rejectedTasks: 0,
            dataTypes: [],
            installationHistory: [],
            lastModified: new Date().toISOString()
          });
        }

        const business = businessMap.get(task.mst);

        business.totalTasks++;
        if (task.status === 'Done') business.completedTasks++;
        if (task.status === 'Pending') business.pendingTasks++;
        if (task.status === 'Rejected') business.rejectedTasks++;

        if (!business.dataTypes.includes(task.typeData)) {
          business.dataTypes.push(task.typeData);
        }

        business.installationHistory.push({
          date: task.AtSetting,
          type: task.typeData,
          installer: task.PInstaller,
          connectionType: task.connectionType,
          PInstaller: task.PInstaller,
          status: task.status,
          notes: task.codeData
        });

        business.lastModified = new Date().toISOString();
      });

      return Array.from(businessMap.values());
    };

    const processedBusinesses = extractBusinesses();
    setBusinesses(processedBusinesses);
    setFilteredBusinesses(processedBusinesses);
  }, []);

  const handleBusinessCreated = (newBusiness) => {
    const updatedBusinesses = [...businesses, newBusiness];
    setBusinesses(updatedBusinesses);
    setFilteredBusinesses(updatedBusinesses);
    setOpenModalCreateBusiness(false);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = businesses.filter(business =>
      business.mst.toLowerCase().includes(term) ||
      business.name.toLowerCase().includes(term) ||
      business.address.toLowerCase().includes(term)
    );

    setFilteredBusinesses(filtered);
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
    setBusinesses(updatedBusinesses);
    setFilteredBusinesses(updatedBusinesses);
    setEditModalOpen(false);
  };

  const handleMoreOptions = (business) => {
    setSelectedBusiness(business);
    setMoreModalOpen(true);
    setActiveDropdown(null);
  };

  // Handle checkbox change
  const handleCheckboxChange = (businessId) => {
    setSelectedBusinessIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(businessId)) {
        return prevSelectedIds.filter(id => id !== businessId);
      } else {
        return [...prevSelectedIds, businessId];
      }
    });
  };

  // Handle delete selected businesses
  const handleDeleteSelected = () => {
    const businessesToDelete = selectedBusinessIds;
    const remainingBusinesses = businesses.filter(business => !businessesToDelete.includes(business.id));
    setBusinesses(remainingBusinesses);
    setFilteredBusinesses(remainingBusinesses);
    setSelectedBusinessIds([]);
  };

  return (
    <div>
      <HeaderPages title="Businesses" />
      <div className="container mx-auto p-4 pb-0">
        {/* Search Bar */}
        <div className="flex justify-between mt-4">
          <div className="flex w-1/3 border border-gray-400 rounded-lg p-2 text-xs py-1">
            <input
              type="text"
              placeholder="Search Business"
              className="w-full bg-transparent focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="mr-2 ml-2" color='#9ca3af' size={18} />
          </div>
        </div>
        {/* Text and create business*/}
        <div className="flex items-center mt-4">
          <p className="text-xs font-bold">
            {filteredBusinesses.length > 0 ? `Tổng (${filteredBusinesses.length}) doanh nghiệp`
              : "No businesses found"}
          </p>
          <button
            className="bg-blue-500 text-white ml-8 px-6 py-1 rounded-md text-xs hover:bg-blue-600 flex items-center space-x-1"
            onClick={() => setOpenModalCreateBusiness((prev) => !prev)}
          >
            <span>{openModalCreateBusiness ? "- Close" : "+ Thêm"}</span>
          </button>

          {/* Button to delete selected businesses */}
          {selectedBusinessIds.length > 0 && (
            <button
              className="bg-red-500 text-white ml-4 px-6 py-1 rounded-md text-xs hover:bg-red-600"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          )}
        </div>

        {openModalCreateBusiness ? (
          <CreateBusiness
            closeModal={() => setOpenModalCreateBusiness(false)}
            businesses={businesses}
            onBusinessCreated={handleBusinessCreated}
          />
        ) : (
          <>
            {/* Business List */}
            <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0">
                    <tr className='text-xs'>
                      {/* Checkbox Column */}
                      <th className="p-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          onChange={() => {
                            if (selectedBusinessIds.length === filteredBusinesses.length) {
                              setSelectedBusinessIds([]); 
                            } else {
                              setSelectedBusinessIds(filteredBusinesses.map(business => business.id));
                            }
                          }}
                          checked={selectedBusinessIds.length === filteredBusinesses.length}
                        />
                      </th>
                      <th className="p-3">MST</th>
                      <th className="p-3">Tên công ty</th>
                      <th className="p-3">Địa chỉ</th>
                      <th className="p-3">Số lần</th>
                      <th className="p-3">Hoàn thành</th>
                      <th className='p-3'>Đang làm</th>
                      <th className='p-3'>Từ chối</th>
                      <th className="p-3">Loại dữ liệu</th>
                      <th className="p-3">Người lắp đặt</th>
                      <th className="p-3">Ngày cập nhật</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBusinesses.length > 0 ? (
                      filteredBusinesses.map((business, index) => (
                        <tr key={business.id} className="border-t hover:bg-gray-50 text-xs">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={selectedBusinessIds.includes(business.id)}
                              onChange={() => handleCheckboxChange(business.id)}
                            />
                          </td>
                          <td className="p-3">{business.mst}</td>
                          <td className="p-3">{business.name}</td>
                          <td className="p-3">{business.address}</td>
                          <td className="p-3 bg-cyan-100 text-cyan-600 border border-cyan-200 ">{business.totalTasks}</td>
                          <td className="p-3 bg-green-100 text-green-600 border border-green-200 ">{business.completedTasks}</td>
                          <td className="p-3 bg-orange-100 text-orange-600 border border-orange-200">{business.pendingTasks}</td>
                          <td className="p-3 bg-red-100 text-red-600 border border-red-200">{business.rejectedTasks}</td>
                          <td className="p-3">{business.dataTypes.join(', ')}</td>
                          <td className='p-3'>{business.PInstaller}</td>
                          <td className="p-3">{new Date(business.lastModified).toLocaleDateString()}</td>
                          <td className="p-3 text-right relative">
                            <div>
                              <MoreVertical
                                className="cursor-pointer"
                                size={18}
                                onClick={() => toggleDropdown(index)}
                              />
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
                        <td colSpan={10} className="px-3 py-8 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-gray-500">No businesses found</p>
                            {searchTerm && (
                              <button
                                className="mt-2 text-blue-600 hover:text-blue-800"
                                onClick={() => setSearchTerm("")}
                              >
                                Clear search
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
          </>)}
        {/* Edit Business Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Business Information"
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
      </div>
    </div>
  );
};
