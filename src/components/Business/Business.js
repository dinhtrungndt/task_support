import React from 'react';
import {
  MoreHorizontal,
  Building2,
  MapPin,
  CreditCard,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  AlertTriangle,
  Package
} from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import moment from 'moment';
import { formatDate } from '../../utils/formatDate';

export const BusinessList = ({
  filteredBusinesses,
  loading,
  searchTerm,
  activeDropdown,
  selectedBusinessIds,
  toggleDropdown,
  handleCheckboxChange,
  handleSelectAllChange,
  handleEditBusiness,
  handleMoreOptions,
  setSearchTerm,
  setActiveDropdown
}) => {

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wider border-b border-gray-200">
              <th className="sticky top-0 bg-gray-50 z-10 p-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                    onChange={handleSelectAllChange}
                    checked={selectedBusinessIds.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                  />
                </div>
              </th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MST</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công ty</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoàn thành</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đang làm</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Từ chối</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại dữ liệu</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng BH</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BH còn</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BH hết hạn</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại BH</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhật</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={15} className="p-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-600 mb-3"></div>
                    <p className="font-medium">Đang tải dữ liệu...</p>
                    <p className="text-xs text-gray-400 mt-1">Vui lòng đợi trong giây lát</p>
                  </div>
                </td>
              </tr>
            ) : filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business, index) => (
                <tr
                  key={business._id || index}
                  className={`text-sm hover:bg-indigo-50 transition-colors ${selectedBusinessIds.includes(business._id) ? 'bg-indigo-50' : ''}`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                      checked={selectedBusinessIds.includes(business._id)}
                      onChange={() => handleCheckboxChange(business._id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-900">
                    <div className="flex items-center">
                      <CreditCard size={14} className="text-gray-400 mr-1.5" />
                      <span className="font-mono">{business.mst}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                        <Building2 size={12} />
                      </div>
                      <span className="font-medium text-gray-800">{business.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center text-gray-500 max-w-xs truncate">
                      <MapPin size={14} className="text-gray-400 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{business.address}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full border border-cyan-200">
                      <Package size={12} className="mr-1" />
                      {business.totalTasks || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                      <CheckCircle size={12} className="mr-1" />
                      {business.completedTasks || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
                      <Clock size={12} className="mr-1" />
                      {business.pendingTasks || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                      <XCircle size={12} className="mr-1" />
                      {business.rejectedTasks || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    {business.typeData && business.typeData.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {business.typeData.map((type, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 border border-gray-200">
                            <Tag size={10} className="mr-1 text-gray-500" />
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Chưa có</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
                      <Shield size={12} className="mr-1" />
                      {business.totalServices || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                      <CheckCircle size={12} className="mr-1" />
                      {business.activeServices || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                      <AlertTriangle size={12} className="mr-1" />
                      {business.inactionServices || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    {business.serviceTypes && business.serviceTypes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {business.serviceTypes.map((type, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <Shield size={10} className="mr-1 text-indigo-500" />
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Chưa có</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={14} className="text-gray-400 mr-1.5" />
                      <span>{business.updatedAt ? formatDate(business.updatedAt) : 'Chưa cập nhật'}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right relative">
                    <div>
                      <button
                        className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                        onClick={() => toggleDropdown(index)}
                      >
                        <MoreHorizontal className="text-gray-500" size={16} />
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
                <td colSpan={15} className="px-3 py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                      <Building2 size={32} />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">Không tìm thấy doanh nghiệp nào</p>
                    <p className="text-gray-400 text-sm max-w-md mb-4">
                      Không tìm thấy doanh nghiệp nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các từ khóa khác.
                    </p>
                    {searchTerm && (
                      <button
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors flex items-center"
                        onClick={() => setSearchTerm("")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
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

      {/* Footer with pagination (placeholder) */}
      {filteredBusinesses.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Trước
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredBusinesses.length > 10 ? 10 : filteredBusinesses.length}</span> trong <span className="font-medium">{filteredBusinesses.length}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Trang trước</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Trang sau</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessList;