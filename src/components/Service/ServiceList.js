import React from "react";
import {
  MoreHorizontal,
  AlertTriangle,
  Building,
  Tag,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Clipboard,
  Shield,
  CreditCard
} from "lucide-react";
import DropdownMenu from "../DropdownMenu";
import moment from "moment";
import ServiceExpiryStatus from "../../utils/ServiceExpiryStatus";

const ServiceList = ({
  filteredServices,
  loading,
  searchTerm,
  activeDropdown,
  selectedServiceIds,
  toggleDropdown,
  handleCheckboxChange,
  handleSelectAllChange,
  handleEditService,
  handleMoreOptions,
  setSearchTerm,
  setActiveDropdown,
}) => {
  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Format date
  const formatDate = (dateString) => {
    const currentTime = moment();
    const postTime = moment(dateString);
    const diffInSeconds = currentTime.diff(postTime, "seconds");

    if (diffInSeconds < 1) {
      return "Vừa đăng";
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 24 * 3600) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else if (diffInSeconds < 30 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (24 * 3600))} ngày trước`;
    } else if (diffInSeconds < 12 * 30 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (30 * 24 * 3600))} tháng trước`;
    } else if (diffInSeconds < 12 * 365 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (12 * 30 * 24 * 3600))} năm trước`;
    } else {
      return postTime.format("DD/MM/YYYY");
    }
  };

  // Format expiration date
  const formatExpirationDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Get service type badge style
  const getServiceTypeBadge = (type) => {
    switch (type) {
      case "Data":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cloud":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "Network":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Get service status badge style
  const getStatusBadge = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    return status === "Active"
      ? <CheckCircle size={12} className="mr-1" />
      : <XCircle size={12} className="mr-1" />;
  };

  // Kiểm tra nếu không có dịch vụ nào
  if (filteredServices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Shield size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Không tìm thấy dịch vụ nào
          </h3>
          {searchTerm && (
            <div className="text-sm text-gray-500 max-w-md">
              <p className="mb-4">Không tìm thấy kết quả nào cho từ khóa "<span className="font-medium text-gray-700">{searchTerm}</span>". Vui lòng
              thử từ khóa khác hoặc xem tất cả dịch vụ.</p>
              <button
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors flex items-center mx-auto"
                onClick={() => setSearchTerm("")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                    checked={
                      selectedServiceIds.length === filteredServices.length &&
                      filteredServices.length > 0
                    }
                    onChange={handleSelectAllChange}
                  />
                </div>
              </th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại dịch vụ</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MST</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh nghiệp</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá dịch vụ</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời hạn</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhật</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServices.map((service, index) => (
              <tr
                key={`${service._id}-${index}`}
                className={`text-sm hover:bg-indigo-50 transition-colors ${
                  selectedServiceIds.includes(service._id) ? "bg-indigo-50" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                    checked={selectedServiceIds.includes(service._id)}
                    onChange={() => handleCheckboxChange(service._id)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                      <Shield size={12} />
                    </div>
                    <span className="font-medium text-gray-800">{service.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getServiceTypeBadge(service.type)}`}>
                      <Tag size={12} className="mr-1" />
                      {service.type || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <CreditCard size={14} className="text-gray-400 mr-1.5" />
                    <span className="font-mono text-gray-700">{service.companyId?.mst || "N/A"}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-2">
                      <Building size={12} />
                    </div>
                    <span className="text-gray-800">{service.companyId?.name || "N/A"}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center text-gray-700">
                    <DollarSign size={14} className="text-gray-400 mr-1.5" />
                    <span className="font-medium">{formatPrice(service.price)}</span>
                    <span className="text-gray-500 ml-1">VNĐ</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-1.5" />
                      <span className="text-gray-700">{service.duration || 0} tháng</span>
                    </div>
                    {/* Thêm component hiển thị thời hạn còn lại */}
                    <ServiceExpiryStatus service={service} />
                    {service.expirationDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Hết hạn: {formatExpirationDate(service.expirationDate)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {service.status || "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={14} className="text-gray-400 mr-1.5" />
                    <span>{formatDate(service.createdAt)}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center text-gray-600">
                    <Clipboard size={14} className="text-gray-400 mr-1.5" />
                    <span>
                      {formatDate(
                        service.lastModified !== service.createdAt
                          ? service.lastModified
                          : service.createdAt
                      )}
                    </span>
                  </div>
                </td>
                <td className="p-3 relative">
                  <div>
                    <button
                      className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                      onClick={() => toggleDropdown(index)}
                    >
                      <MoreHorizontal className="text-gray-500" size={16} />
                    </button>
                    <DropdownMenu
                      isOpen={activeDropdown === index}
                      onEdit={() => handleEditService(service)}
                      onMore={() => handleMoreOptions(service)}
                      onClose={() => setActiveDropdown(null)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination (placeholder) */}
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
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredServices.length > 10 ? 10 : filteredServices.length}</span> trong <span className="font-medium">{filteredServices.length}</span> dịch vụ
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
    </div>
  );
};

export default ServiceList;