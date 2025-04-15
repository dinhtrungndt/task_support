import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const CSRFToken = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Lấy CSRF token từ server (tùy thuộc vào cấu hình backend của bạn)
    const fetchCSRFToken = async () => {
      try {
        const response = await axiosClient.get('/csrf-token');
        const token = response.data.csrfToken;
        setCsrfToken(token);

        // Đặt token vào meta tag để sử dụng trong interceptor
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
          metaTag.setAttribute('content', token);
        } else {
          // Tạo meta tag mới nếu chưa có
          const newMetaTag = document.createElement('meta');
          newMetaTag.setAttribute('name', 'csrf-token');
          newMetaTag.setAttribute('content', token);
          document.head.appendChild(newMetaTag);
        }
      } catch (error) {
        // console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  return (
    <input type="hidden" name="_csrf" value={csrfToken} />
  );
};

export default CSRFToken;