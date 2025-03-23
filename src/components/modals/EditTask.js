import { useState } from 'react';
import { Code, FileText, MapPin, Link, User, Calendar } from 'lucide-react';

const EditTaskModal = ({ task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      mst: task?.mst || '',
      name: task?.name || '',
      address: task?.address || '',
      connectionType: task?.connectionType || '',
      PInstaller: task?.PInstaller || '',
      codeData: task?.codeData || '',
      typeData: task?.typeData || '',
      AtSetting: task?.AtSetting || '',
      status: task?.status || 'Pending'
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã số thuế (MST)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Code size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="mst"
                value={formData.mst}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Nhập mã số thuế"
              />
            </div>
          </div>
  
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên công ty
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FileText size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Nhập tên công ty"
              />
            </div>
          </div>
  
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <MapPin size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
  
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại kết nối
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Link size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="connectionType"
                value={formData.connectionType}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Nhập loại kết nối"
              />
            </div>
          </div>
  
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người lắp đặt
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="PInstaller"
                value={formData.PInstaller}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Nhập người lắp đặt"
              />
            </div>
          </div>
  
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã dữ liệu
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Code size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="codeData"
                value={formData.codeData}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Nhập mã dữ liệu"
              />
            </div>
          </div>
  
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại dữ liệu
            </label>
              <select
                name="typeData"
                value={formData.typeData}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
              >
                <option value="Type 1">Lựa chọn</option>
                <option value="Cloud">Cloud</option>
                <option value="Data">Data</option>
              </select>
          </div>
  
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày lắp
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Calendar size={16} className="text-gray-400 mr-2" />
              <input
                type="date"
                name="AtSetting"
                value={formData.AtSetting}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
              />
            </div>
          </div>
  
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
  
        <div className="flex justify-end mt-6 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    );
  };

    export default EditTaskModal;