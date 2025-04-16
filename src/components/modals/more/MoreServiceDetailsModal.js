import React from 'react';
import { Building, User, Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react';

const MoreServiceDetailsModal = ({ service }) => {
  if (!service) return <div>Không có thông tin.</div>;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date without time
  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  // Calculate remaining time until expiration
  const getRemainingTime = () => {
    if (!service.expirationDate) return null;

    const expiryDate = new Date(service.expirationDate);
    const currentDate = new Date();

    // If already expired
    if (expiryDate < currentDate) {
      return { expired: true, days: 0, text: "Đã hết hạn" };
    }

    // Calculate days remaining
    const diffTime = Math.abs(expiryDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format based on remaining time
    let text = `${diffDays} ngày`;
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      text = `${months} tháng ${remainingDays > 0 ? `${remainingDays} ngày` : ''}`;
    }

    return { expired: false, days: diffDays, text };
  };

  // Get expiration status CSS class
  const getExpirationStatusClass = () => {
    if (!service.expirationDate) return '';

    const expiryDate = new Date(service.expirationDate);
    const currentDate = new Date();

    if (expiryDate < currentDate) return 'text-red-500';

    const diffTime = Math.abs(expiryDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 'text-red-500';
    if (diffDays <= 30) return 'text-amber-500';
    return 'text-green-500';
  };

  // Get expiration info
  const remainingTime = getRemainingTime();
  const expirationStatusClass = getExpirationStatusClass();

  return (
    <div className="space-y-2 max-h-[80vh] overflow-y-auto px-1">
      {/* Basic Information */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">Thông tin cơ bản</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500 w-1/3">ID</td>
                <td className="px-2 py-1.5 text-gray-900 break-all">{service._id}</td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">Tên dịch vụ</td>
                <td className="px-2 py-1.5 text-gray-900">{service.name}</td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">Loại dịch vụ</td>
                <td className="px-2 py-1.5 text-gray-900">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    service.type === 'Data' ? 'bg-blue-100 text-blue-800' :
                    service.type === 'Cloud' ? 'bg-purple-100 text-purple-800' :
                    service.type === 'Network' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {service.type}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">Mô tả</td>
                <td className="px-2 py-1.5 text-gray-900">{service.description || 'Không có mô tả'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Information */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">Thông tin doanh nghiệp</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500 w-1/3">
                  <div className="flex items-center">
                    <Building className="mr-1" size={12} />
                    <span>Tên doanh nghiệp</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">
                  {service.companyId?.name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <Building className="mr-1" size={12} />
                    <span>Mã số thuế</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">
                  {service.companyId?.mst || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="mr-1" size={12} />
                    <span>Địa chỉ</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">
                  {service.companyId?.address || 'Không có địa chỉ'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing & Duration */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">Giá và thời hạn</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500 w-1/3">Giá dịch vụ</td>
                <td className="px-2 py-1.5 text-gray-900">{formatPrice(service.price)} VNĐ</td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">Thời hạn</td>
                <td className="px-2 py-1.5 text-gray-900">{service.duration} tháng</td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={12} />
                    <span>Ngày bắt đầu</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">
                  {service.startDate ? formatDateOnly(service.startDate) : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={12} />
                    <span>Ngày hết hạn</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">
                  {service.expirationDate ? formatDateOnly(service.expirationDate) : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <Clock className="mr-1" size={12} />
                    <span>Thời gian còn lại</span>
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  {remainingTime ? (
                    <div className={`flex items-center ${expirationStatusClass}`}>
                      {remainingTime.expired ? (
                        <AlertTriangle size={12} className="mr-1" />
                      ) : (
                        <Clock size={12} className="mr-1" />
                      )}
                      <span>{remainingTime.expired ? 'Đã hết hạn' : `Còn lại: ${remainingTime.text}`}</span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">Trạng thái</td>
                <td className="px-2 py-1.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                  {service.expirationDate && new Date(service.expirationDate) < new Date() && service.status === 'Active' && (
                    <span className="ml-2 text-xs text-red-500 inline-flex items-center">
                      <AlertTriangle size={10} className="mr-1" />
                      Đã hết hạn nhưng vẫn Active
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">Tính năng ({service.features?.length || 0})</h3>
        {service.features && service.features.length > 0 ? (
          <div className="border border-gray-200 rounded-md overflow-hidden max-h-24 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {service.features.map((feature, index) => (
                <li key={index} className="px-2 py-1.5 text-xs text-gray-900">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">Không có tính năng nào.</p>
        )}
      </div>

      {/* Metadata */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">Thông tin khác</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500 w-1/3">
                  <div className="flex items-center">
                    <User className="mr-1" size={12} />
                    <span>Người tạo</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">
                  {service.userCreated?.name || 'N/A'}
                  {service.userCreated?.email && (
                    <span className="text-xs text-gray-500 ml-2">({service.userCreated.email})</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={12} />
                    <span>Ngày tạo</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">{formatDate(service.createdAt)}</td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 bg-gray-50 font-medium text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={12} />
                    <span>Cập nhật lần cuối</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-gray-900">{formatDate(service.lastModified)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoreServiceDetailsModal;