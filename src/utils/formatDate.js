import moment from "moment";

export const formatDate = (dateString) => {
    const currentTime = moment();
    const postTime = moment(dateString);
    const diffInSeconds = currentTime.diff(postTime, 'seconds');

    if (diffInSeconds < 1) {
        return 'Vừa đăng';
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
        return postTime.format('DD/MM/YYYY');
    }
};

export const formatDateDetail = (dateString) => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (e) {
        return dateString;
    }
};

export const formatDateOnlyDetail = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export   const formatExpirationDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD/MM/YYYY");
  };