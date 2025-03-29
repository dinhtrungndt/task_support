import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

export const EditBusinessModal = ({ 
  business, 
  onClose, 
  onSave 
}) => {
  const [editedBusiness, setEditedBusiness] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (business) {
      // Initialize the form with the business data
      setEditedBusiness({
        ...business
      });
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

  const handleSave = async () => {
    if (!editedBusiness) return;
    
    // Validate required fields
    if (!editedBusiness.mst || !editedBusiness.name || !editedBusiness.address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!editedBusiness._id) {
        console.error("Missing _id in editedBusiness:", editedBusiness);
        toast.error("Lỗi: ID doanh nghiệp không xác định");
        return;
      }
      
      // Only pass fields that are accepted by the backend API
      const businessToUpdate = {
        _id: editedBusiness._id,
        mst: editedBusiness.mst,
        name: editedBusiness.name,
        address: editedBusiness.address
      };
      
      await onSave(businessToUpdate);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("Lỗi khi cập nhật: " + (error.message || "Đã xảy ra lỗi"));
    } finally {
      setIsSubmitting(false);
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
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MST <span className="text-gray-400 text-xs">(không thể thay đổi)</span>
            </label>
            <input
              type="text"
              name="mst"
              value={editedBusiness.mst || ''}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên công ty <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={editedBusiness.name || ''}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên công ty"
              required
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={editedBusiness.address || ''}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập địa chỉ"
              required
            />
          </div>
        </div>
        
        {/* Read-only information */}
        {editedBusiness.typeData && editedBusiness.typeData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin khác (chỉ đọc)</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Loại dữ liệu</p>
                <div className="flex flex-wrap gap-1">
                  {editedBusiness.typeData.map((type, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Tổng công việc</p>
                  <p className="text-sm font-medium">{editedBusiness.totalTasks || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Hoàn thành</p>
                  <p className="text-sm font-medium text-green-600">{editedBusiness.completedTasks || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Đang làm</p>
                  <p className="text-sm font-medium text-amber-600">{editedBusiness.pendingTasks || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Từ chối</p>
                  <p className="text-sm font-medium text-red-600">{editedBusiness.rejectedTasks || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Lưu ý: Các trường khác như loại dữ liệu và thống kê công việc sẽ được cập nhật tự động khi bạn thêm hoặc cập nhật các task.
          </p>
        </div>
      </div>
      
      {/* Footer with buttons */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu...
            </span>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
};

export default EditBusinessModal;