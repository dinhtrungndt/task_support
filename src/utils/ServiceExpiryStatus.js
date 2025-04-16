import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

// Component hiển thị trạng thái hết hạn và thời gian còn lại của dịch vụ
const ServiceExpiryStatus = ({ service }) => {
  // Tính toán thời gian còn lại
  const getRemainingTime = () => {
    if (!service.expirationDate) return null;

    const expiryDate = new Date(service.expirationDate);
    const currentDate = new Date();

    // Nếu đã hết hạn
    if (expiryDate < currentDate) {
      return { expired: true, days: 0, text: "Đã hết hạn" };
    }

    // Tính số ngày còn lại
    const diffTime = Math.abs(expiryDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Định dạng văn bản dựa trên thời gian còn lại
    let text = `${diffDays} ngày`;
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      text = `${months} tháng ${remainingDays > 0 ? `${remainingDays} ngày` : ''}`;
    }

    return { expired: false, days: diffDays, text };
  };

  const remaining = getRemainingTime();
  if (!remaining) return null;

  // Dưới 30 ngày là cảnh báo, dưới 7 ngày là nguy cấp
  const getStatusClass = () => {
    if (remaining.expired || service.status === 'Inactive') return 'text-red-500';
    if (remaining.days <= 7) return 'text-red-500';
    if (remaining.days <= 30) return 'text-amber-500';
    return 'text-green-500';
  };

  const statusClass = getStatusClass();

  return (
    <div className={`flex items-center text-xs ${statusClass} mt-1`}>
      {remaining.expired || service.status === 'Inactive' ? (
        <AlertTriangle size={12} className="mr-1" />
      ) : (
        <Clock size={12} className="mr-1" />
      )}
      <span>
        {remaining.expired ? 'Đã hết hạn' : `Còn lại: ${remaining.text}`}
      </span>
    </div>
  );
};

export default ServiceExpiryStatus;