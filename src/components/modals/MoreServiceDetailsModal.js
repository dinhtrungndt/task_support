import React from 'react';

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

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin cơ bản</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">ID</td>
                <td className="px-4 py-2 text-sm text-gray-900">{service._id}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Tên dịch vụ</td>
                <td className="px-4 py-2 text-sm text-gray-900">{service.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Loại dịch vụ</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Mô tả</td>
                <td className="px-4 py-2 text-sm text-gray-900">{service.description || 'Không có mô tả'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing & Duration */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Giá và thời hạn</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Giá dịch vụ</td>
                <td className="px-4 py-2 text-sm text-gray-900">{formatPrice(service.price)} VNĐ</td>
              </tr>
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Thời hạn</td>
                <td className="px-4 py-2 text-sm text-gray-900">{service.duration} tháng</td>
              </tr>
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Trạng thái</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Tính năng ({service.features?.length || 0})</h3>
        {service.features && service.features.length > 0 ? (
          <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
            {service.features.map((feature, index) => (
              <li key={index} className="px-4 py-2 text-sm text-gray-900">
                • {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Không có tính năng nào.</p>
        )}
      </div>

      {/* Metadata */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin khác</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Người tạo</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {service.userCreated?.name || service.userCreated || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Ngày tạo</td>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(service.createdAt)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Cập nhật lần cuối</td>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(service.lastModified)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoreServiceDetailsModal;