import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-6xl text-blue-600 font-bold mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Trang không tìm thấy</h1>
      <p className="text-gray-600 mb-6 text-center">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotFound;