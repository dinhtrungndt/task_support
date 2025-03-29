import React, { useState, useEffect } from 'react';
import { Code, FileText, MapPin, Link, User, Calendar, Database, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    _id: '',
    mst: '',
    companyName: '',
    address: '',
    connectionType: '',
    installer: '',
    codeData: '',
    typeData: '',
    installDate: '',
    status: 'Pending',
    notes: ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      // Initialize form with task data
      setFormData({
        _id: task._id || '',
        mst: task.mst || '',
        companyName: task.companyName || '',
        address: task.address || '',
        connectionType: task.connectionType || '',
        installer: task.installer || '',
        codeData: task.codeData || '',
        typeData: task.typeData || 'Data',
        installDate: task.installDate ? new Date(task.installDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: task.status || 'Pending',
        notes: task.notes || ''
      });
      
      // Reset change tracking
      setHasChanges(false);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form - check required fields
    if (!formData._id || !formData.status) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    // Validate notes for rejected status
    if (formData.status === 'Rejected' && !formData.notes) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call onSave callback with the updated task
      await onSave(formData);
      
      toast.success('Cập nhật công việc thành công');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Lỗi khi cập nhật công việc: ' + (error.message || 'Đã xảy ra lỗi'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If no task is provided, don't render
  if (!task) return null;

  return (
    <div className="bg-white rounded-lg overflow-hidden max-h-[70vh] flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Scrollable content area */}
        <div className="p-3 overflow-y-auto flex-grow space-y-3">
          {/* Company Info Card (compact) */}
          <div className="bg-blue-50 p-2 rounded-lg">
            <h3 className="text-xs font-medium text-blue-800 mb-2">Thông tin doanh nghiệp</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  MST
                </label>
                <div className="flex items-center h-8 bg-gray-50 border border-gray-300 rounded-md">
                  <Code size={12} className="text-gray-400 ml-2 mr-1" />
                  <input
                    type="text"
                    value={formData.mst}
                    readOnly
                    className="w-full py-1 px-1 bg-gray-50 text-gray-700 text-xs focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Tên công ty
                </label>
                <div className="flex items-center h-8 bg-gray-50 border border-gray-300 rounded-md">
                  <FileText size={12} className="text-gray-400 ml-2 mr-1" />
                  <input
                    type="text"
                    value={formData.companyName}
                    readOnly
                    className="w-full py-1 px-1 bg-gray-50 text-gray-700 text-xs focus:outline-none cursor-not-allowed truncate"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Địa chỉ
              </label>
              <div className="flex items-center h-8 bg-gray-50 border border-gray-300 rounded-md">
                <MapPin size={12} className="text-gray-400 ml-2 mr-1 flex-shrink-0" />
                <input
                  type="text"
                  value={formData.address}
                  readOnly
                  className="w-full py-1 px-1 bg-gray-50 text-gray-700 text-xs focus:outline-none cursor-not-allowed truncate"
                />
              </div>
            </div>
          </div>
          
          {/* Task Information */}
          <div>
            <h3 className="text-xs font-medium text-gray-700 mb-2">Thông tin công việc</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Loại kết nối <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center h-8 border border-gray-300 rounded-md">
                  <Link size={12} className="text-gray-400 ml-2 mr-1" />
                  <input
                    type="text"
                    name="connectionType"
                    value={formData.connectionType}
                    onChange={handleChange}
                    className="w-full py-1 px-1 text-xs focus:outline-none"
                    placeholder="Nhập loại kết nối"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Người lắp đặt
                </label>
                <div className="flex items-center h-8 border border-gray-300 rounded-md">
                  <User size={12} className="text-gray-400 ml-2 mr-1" />
                  <input
                    type="text"
                    name="installer"
                    value={formData.installer}
                    onChange={handleChange}
                    className="w-full py-1 px-1 text-xs focus:outline-none"
                    placeholder="Nhập người lắp đặt"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Mã dữ liệu
                </label>
                <div className="flex items-center h-8 border border-gray-300 rounded-md">
                  <Code size={12} className="text-gray-400 ml-2 mr-1" />
                  <input
                    type="text"
                    name="codeData"
                    value={formData.codeData}
                    onChange={handleChange}
                    className="w-full py-1 px-1 text-xs focus:outline-none"
                    placeholder="Nhập mã dữ liệu"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Loại dữ liệu
                </label>
                <div className="flex items-center h-8 border border-gray-300 rounded-md">
                  <Database size={12} className="text-gray-400 ml-2 mr-1" />
                  <select
                    name="typeData"
                    value={formData.typeData}
                    onChange={handleChange}
                    className="w-full h-full py-0 px-1 text-xs focus:outline-none border-none"
                  >
                    <option value="Data">Data</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Ngày lắp đặt
                </label>
                <div className="flex items-center h-8 border border-gray-300 rounded-md">
                  <Calendar size={12} className="text-gray-400 ml-2 mr-1" />
                  <input
                    type="date"
                    name="installDate"
                    value={formData.installDate}
                    onChange={handleChange}
                    className="w-full py-0 px-1 text-xs focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center h-8 border border-gray-300 rounded-md">
                  <CheckCircle size={12} className="text-gray-400 ml-2 mr-1" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full h-full py-0 px-1 text-xs focus:outline-none border-none"
                  >
                    <option value="Pending">Đang làm</option>
                    <option value="Done">Hoàn thành</option>
                    <option value="Rejected">Từ chối</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Rejection Reason - only show when status is Rejected */}
            {formData.status === 'Rejected' && (
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-700">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start">
                  <AlertTriangle size={12} className="text-red-400 mr-1 mt-1.5 flex-shrink-0" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Vui lòng nhập lý do từ chối công việc"
                    rows={2}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 ml-5">
                  Lý do từ chối sẽ được ghi lại trong lịch sử.
                </p>
              </div>
            )}
            
            {/* Changed indicator */}
            {hasChanges && (
              <div className="mt-2 p-1.5 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-xs text-blue-700 flex items-center">
                  <Info size={12} className="mr-1 flex-shrink-0" />
                  Bạn đã thay đổi thông tin. Nhớ lưu lại để áp dụng.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions - Fixed at bottom */}
        <div className="flex justify-end space-x-2 p-2 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={`px-3 py-1.5 rounded-md text-xs font-medium text-white ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={!hasChanges || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      </form>
    </div>
  );
};

export default EditTaskModal;