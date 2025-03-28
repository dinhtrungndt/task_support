import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const EditBusinessModal = ({ 
  business, 
  onClose, 
  onSave 
}) => {
  const [editedBusiness, setEditedBusiness] = useState(null);

  useEffect(() => {
    if (business) {
      setEditedBusiness({...business});
    }
  }, [business]);

  const handleInputChange = (e) => {
    if (editedBusiness) {
      setEditedBusiness({
        ...editedBusiness,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = () => {
    if (editedBusiness) {
      onSave({
        ...editedBusiness,
        lastModified: new Date().toISOString()
      });
    }
  };

  if (!editedBusiness) return null;

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-medium">Chỉnh sửa thông tin doanh nghiệp</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all text-white"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Form Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MST <span className="text-gray-400 text-xs">(không thể thay đổi)</span></label>
            <input
              type="text"
              name="mst"
              value={editedBusiness.mst}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={editedBusiness.name}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên công ty"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={editedBusiness.address}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập địa chỉ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người liên hệ</label>
            <input
              type="text"
              name="contactPerson"
              value={editedBusiness.contactPerson}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên người liên hệ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={editedBusiness.phone}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={editedBusiness.email}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người cài đặt</label>
            <input
              type="text"
              name="PInstaller"
              value={editedBusiness.PInstaller}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên người cài đặt"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại dữ liệu</label>
            <input
              type="text"
              name="dataTypes"
              value={editedBusiness.dataTypes && Array.isArray(editedBusiness.dataTypes) ? editedBusiness.dataTypes.join(', ') : ''}
              onChange={(e) => {
                if (editedBusiness) {
                  setEditedBusiness({
                    ...editedBusiness,
                    dataTypes: e.target.value.split(',').map(type => type.trim()).filter(type => type !== '')
                  });
                }
              }}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập loại dữ liệu, phân cách bằng dấu phẩy"
            />
            <p className="mt-1 text-xs text-gray-500">Ví dụ: SQL, Oracle, MySQL</p>
          </div>
        </div>
      </div>
      
      {/* Footer with buttons */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditBusinessModal;