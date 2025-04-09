import React from "react";
import { Edit, MoreHorizontal, AlertCircle, Building } from "lucide-react";
import DropdownMenu from "../DropdownMenu";
import moment from "moment";

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

  // Handle click outside of dropdown
  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  // Kiểm tra nếu không có dịch vụ nào
  if (filteredServices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-base font-medium text-gray-900">
            Không tìm thấy dịch vụ nào
          </h3>
          {searchTerm && (
            <p className="text-sm text-gray-500 max-w-md">
              Không tìm thấy kết quả nào cho từ khóa "{searchTerm}". Vui lòng
              thử từ khóa khác hoặc{" "}
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setSearchTerm("")}
              >
                xem tất cả dịch vụ
              </button>
              .
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left w-12">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={
                      selectedServiceIds.length === filteredServices.length &&
                      filteredServices.length > 0
                    }
                    onChange={handleSelectAllChange}
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tên dịch vụ
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại dịch vụ
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                MST
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Doanh nghiệp
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Giá dịch vụ
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thời hạn
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày tạo
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày cập nhật
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tùy chọn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service, index) => (
              <tr
                key={`${service._id}-${index}`}
                className={`hover:bg-gray-50 ${
                  selectedServiceIds.includes(service._id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedServiceIds.includes(service._id)}
                      onChange={() => handleCheckboxChange(service._id)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {service.name}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.type === "Data"
                        ? "bg-blue-100 text-blue-800"
                        : service.type === "Cloud"
                        ? "bg-purple-100 text-purple-800"
                        : service.type === "Network"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {service.type}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {service.companyId?.mst || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {service.companyId?.name || "N/A"}
                    </div>
                    {service.companyId?.mst && (
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Building size={12} className="mr-1" />
                        MST: {service.companyId.mst}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatPrice(service.price)} VNĐ
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.duration} tháng
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(service.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(
                    service.lastModified !== service.createdAt
                      ? service.lastModified
                      : service.createdAt
                  )}
                </td>
                <td className="p-3 border-b text-right relative">
                  <div>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
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
    </div>
  );
};

export default ServiceList;
