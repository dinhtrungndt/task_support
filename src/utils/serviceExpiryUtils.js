/**
 * Tính toán thời gian còn lại đến khi hết hạn
 * @param {Date|string} expirationDate - Ngày hết hạn
 * @returns {Object} - Thông tin thời gian còn lại
 */
export function calculateRemainingTime(expirationDate) {
    if (!expirationDate) return null;

    const expiry = new Date(expirationDate);
    const now = new Date();

    // Nếu đã hết hạn
    if (expiry < now) {
      return {
        expired: true,
        days: 0,
        months: 0,
        text: "Đã hết hạn"
      };
    }

    // Tính số ngày còn lại
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    // Tạo text thân thiện
    let text = '';
    if (months > 0) {
      text = `${months} tháng`;
      if (days > 0) {
        text += ` ${days} ngày`;
      }
    } else {
      text = `${days} ngày`;
    }

    return {
      expired: false,
      days: diffDays,
      months,
      remainingDays: days,
      text: `Còn lại: ${text}`
    };
  }

  /**
   * Tính toán ngày hết hạn từ ngày bắt đầu và số tháng
   * @param {Date|string} startDate - Ngày bắt đầu
   * @param {number} durationMonths - Số tháng
   * @returns {Date} - Ngày hết hạn
   */
  export function calculateExpirationDate(startDate, durationMonths) {
    if (!startDate || isNaN(durationMonths)) return null;

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return null;

    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + Number(durationMonths));

    return expiry;
  }

  /**
   * Kiểm tra xem dịch vụ đã quá hạn chưa
   * @param {Object} service - Đối tượng dịch vụ
   * @returns {boolean} - true nếu đã quá hạn
   */
  export function isServiceExpired(service) {
    if (!service || !service.expirationDate) return false;

    const expiryDate = new Date(service.expirationDate);
    const currentDate = new Date();

    return expiryDate < currentDate;
  }

  /**
   * Lấy trạng thái hết hạn của dịch vụ
   * @param {Object} service - Đối tượng dịch vụ
   * @returns {string} - Trạng thái: 'expired', 'expiring-soon', 'active'
   */
  export function getExpirationStatus(service) {
    if (!service || !service.expirationDate) return 'unknown';

    const expiryDate = new Date(service.expirationDate);
    const currentDate = new Date();

    // Nếu đã hết hạn
    if (expiryDate < currentDate) {
      return 'expired';
    }

    // Tính số ngày còn lại
    const diffTime = expiryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Sắp hết hạn nếu còn dưới 30 ngày
    if (diffDays <= 30) {
      return 'expiring-soon';
    }

    return 'active';
  }

  /**
   * Format ngày hết hạn theo định dạng tiếng Việt
   * @param {Date|string} date - Ngày cần format
   * @returns {string} - Ngày đã được format
   */
  export function formatExpirationDate(date) {
    if (!date) return 'N/A';

    try {
      const dateObj = new Date(date);

      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'N/A';
    }
  }

  /**
   * Lấy class CSS cho trạng thái hết hạn
   * @param {string} status - Trạng thái hết hạn từ getExpirationStatus()
   * @returns {string} - CSS class
   */
  export function getExpirationStatusClass(status) {
    switch (status) {
      case 'expired':
        return 'text-red-500';
      case 'expiring-soon':
        return 'text-amber-500';
      case 'active':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }