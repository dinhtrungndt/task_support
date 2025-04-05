import React from 'react';
import DOMPurify from 'dompurify'; // Cần cài đặt: npm install dompurify

// Component để hiển thị HTML an toàn
const SafeHTML = ({ html, className }) => {
  // Làm sạch HTML đầu vào
  const cleanHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    // Chỉ cho phép một số thẻ HTML cụ thể
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div'],
    // Chỉ cho phép một số thuộc tính an toàn
    ALLOWED_ATTR: ['href', 'target', 'class', 'id', 'style']
  });
  
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

export default SafeHTML;