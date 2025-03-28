import React, { useState, useEffect } from 'react';
import { Code, FileText, MapPin, Link, User, Calendar, Database, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    mst: '',
    name: '',
    address: '',
    connectionType: '',
    PInstaller: '',
    codeData: '',
    typeData: '',
    AtSetting: '',
    status: 'Pending'
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    if (task) {
      // Initialize form with task data
      setFormData({
        mst: task.mst || '',
        name: task.name || '',
        address: task.address || '',
        connectionType: task.connectionType || '',
        PInstaller: task.PInstaller || '',
        codeData: task.codeData || '',
        typeData: task.installationHistory && task.installationHistory[0] ? task.installationHistory[0].type : '',
        AtSetting: task.installationHistory && task.installationHistory[0] ? task.installationHistory[0].date : '',
        status: task.installationHistory && task.installationHistory[0] ? task.installationHistory[0].status : 'Pending'
      });
      
      // Reset change tracking
      setHasChanges(false);
      
      // Set cancellation reason if available
      if (task.installationHistory && task.installationHistory[0] && task.installationHistory[0].notes) {
        setCancellationReason(task.installationHistory[0].notes);
      } else {
        setCancellationReason('');
      }
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

  const handleCancellationReasonChange = (e) => {
    setCancellationReason(e.target.value);
    setHasChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form - check required fields
    if (!formData.mst || !formData.name || !formData.status) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    // Validate cancellation reason for rejected status
    if (formData.status === 'Rejected' && !cancellationReason) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    
    // Create updated task object with installation history
    const updatedTask = {
      ...task,
      ...formData,
      installationHistory: [{
        ...(task.installationHistory && task.installationHistory[0] ? task.installationHistory[0] : {}),
        type: formData.typeData,
        date: formData.AtSetting,
        status: formData.status,
        notes: formData.status === 'Rejected' ? cancellationReason : 
               (task.installationHistory && task.installationHistory[0] ? task.installationHistory[0].notes : '')
      }]
    };
    
    onSave(updatedTask);
  };
  
  // If no task is provided, don't render
  if (!task) return null;

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Information Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Thông tin doanh nghiệp</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MST <span className="text-gray-400 text-xs">(không thể thay đổi)</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                <Code size={16} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  name="mst"
                  value={formData.mst}
                  readOnly
                  className="w-full py-2.5 px-3 bg-gray-50 text-gray-700 focus:outline-none text-sm cursor-not-allowed"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên công ty <span className="text-gray-400 text-xs">(không thể thay đổi)</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                <FileText size={16} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="w-full py-2.5 px-3 bg-gray-50 text-gray-700 focus:outline-none text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ <span className="text-gray-400 text-xs">(không thể thay đổi)</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
              <MapPin size={16} className="text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                name="address"
                value={formData.address}
                readOnly
                className="w-full py-2.5 px-3 bg-gray-50 text-gray-700 focus:outline-none text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        
        {/* Task Information Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin công việc</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại kết nối <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Link size={16} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  name="connectionType"
                  value={formData.connectionType}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 focus:outline-none text-sm"
                  placeholder="Nhập loại kết nối"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người lắp đặt
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <User size={16} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  name="PInstaller"
                  value={formData.PInstaller}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 focus:outline-none text-sm"
                  placeholder="Nhập người lắp đặt"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã dữ liệu
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Code size={16} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  name="codeData"
                  value={formData.codeData}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 focus:outline-none text-sm"
                  placeholder="Nhập mã dữ liệu"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại dữ liệu
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <Database size={16} className="text-gray-400 ml-3 mr-2" />
                <select
                  name="typeData"
                  value={formData.typeData}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 focus:outline-none text-sm border-none"
                >
                  <option value="">Chọn loại dữ liệu</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Data">Data</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày lắp đặt
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Calendar size={16} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="date"
                  name="AtSetting"
                  value={formData.AtSetting}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 focus:outline-none text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <CheckCircle size={16} className="text-gray-400 ml-3 mr-2" />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 focus:outline-none text-sm border-none"
                >
                  <option value="Pending">Đang làm</option>
                  <option value="Done">Hoàn thành</option>
                  <option value="Rejected">Từ chối</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Cancellation Reason - only show when status is Rejected */}
          {formData.status === 'Rejected' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start">
                <AlertTriangle size={16} className="text-red-400 mr-2 mt-2.5" />
                <textarea
                  value={cancellationReason}
                  onChange={handleCancellationReasonChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Vui lòng nhập lý do từ chối công việc"
                  rows={3}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Lý do từ chối sẽ được ghi lại và hiển thị trong lịch sử công việc.
              </p>
            </div>
          )}
          
          {/* Changed indicator */}
          {hasChanges && (
            <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-xs text-blue-700 flex items-center">
                <Info size={14} className="mr-1.5" />
                Bạn đã thay đổi thông tin công việc. Nhớ lưu lại để áp dụng thay đổi.
              </p>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!hasChanges}
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;