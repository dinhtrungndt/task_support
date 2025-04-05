import React from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

// Toast thành công
export const successToast = (message) => {
  return toast.success(
    <div className="flex">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
      <div className="ml-2 text-sm font-medium">{message}</div>
    </div>
  );
};

// Toast lỗi
export const errorToast = (message) => {
  return toast.error(
    <div className="flex">
      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
      <div className="ml-2 text-sm font-medium">{message}</div>
    </div>
  );
};

// Toast thông tin
export const infoToast = (message) => {
  return toast.info(
    <div className="flex">
      <Info className="h-5 w-5 text-blue-500 mr-2" />
      <div className="ml-2 text-sm font-medium">{message}</div>
    </div>
  );
};

// Toast cảnh báo
export const warningToast = (message) => {
  return toast.warning(
    <div className="flex">
      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
      <div className="ml-2 text-sm font-medium">{message}</div>
    </div>
  );
};

// Toast lỗi API
export const apiErrorToast = (error) => {
  let message = 'Đã xảy ra lỗi không xác định';
  
  if (error.response) {
    // Phản hồi từ server với mã lỗi
    const { status, data } = error.response;
    
    if (data && data.message) {
      message = data.message;
    } else {
      switch (status) {
        case 400: message = 'Yêu cầu không hợp lệ'; break;
        case 401: message = 'Không được phép truy cập. Vui lòng đăng nhập lại'; break;
        case 403: message = 'Bạn không có quyền thực hiện hành động này'; break;
        case 404: message = 'Không tìm thấy tài nguyên'; break;
        case 429: message = 'Quá nhiều yêu cầu. Vui lòng thử lại sau'; break;
        case 500: message = 'Lỗi máy chủ. Vui lòng thử lại sau'; break;
        default: message = `Lỗi ${status}: ${data.message || 'Đã xảy ra lỗi'}`;
      }
    }
  } else if (error.request) {
    // Không nhận được phản hồi từ server
    message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng';
  } else {
    // Lỗi khi thiết lập yêu cầu
    message = error.message || 'Đã xảy ra lỗi khi gửi yêu cầu';
  }
  
  return toast.error(
    <div className="flex">
      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
      <div className="ml-2 text-sm font-medium">{message}</div>
    </div>
  );
};