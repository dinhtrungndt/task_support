import React, { useState, useEffect, useContext, useRef } from 'react';
import { Plus, X, Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/start/AuthContext';

const EditServiceModal = ({ service, onClose, onSave }) => {
  const auth = useContext(AuthContext);
  const { user } = auth;
  const isMounted = useRef(true);
  
  // Get all users from the Redux store
  const { users } = useSelector(state => state.users);
  
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    type: 'Data',
    description: '',
    price: '',
    duration: '',
    status: 'Active',
    features: [],
    userCreated: ''
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User selection state
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Initialize form with service data
  useEffect(() => {
    if (service) {
      setFormData({
        _id: service._id || '',
        name: service.name || '',
        type: service.type || 'Data',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        status: service.status || 'Active',
        features: service.features || [],
        userCreated: service.userCreated || ''
      });
      
      // Find the user object from the users array
      const userObj = users.find(u => u._id === service.userCreated);
      if (userObj) {
        setSelectedUser(userObj);
      }
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [service, users]);
  
  // Filter users based on search term
  useEffect(() => {
    if (userSearch.trim() === '') {
      setFilteredUsers(users || []);
    } else {
      const searchTerm = userSearch.toLowerCase().trim();
      const filtered = (users || []).filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(searchTerm))
      );
      setFilteredUsers(filtered);
    }
  }, [userSearch, users]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle user selection
  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    setFormData(prev => ({
      ...prev,
      userCreated: selectedUser._id
    }));
    setUserSearch('');
    setShowUserDropdown(false);
  };

  // Add feature to the list
  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  // Remove feature from the list
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên dịch vụ không được để trống';
    }
    
    if (!formData.type) {
      newErrors.type = 'Vui lòng chọn loại dịch vụ';
    }
    
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Giá dịch vụ phải là số dương';
    }
    
    if (formData.duration === '' || isNaN(formData.duration) || Number(formData.duration) < 1) {
      newErrors.duration = 'Thời hạn phải là số nguyên dương';
    }
    
    if (!formData.userCreated) {
      newErrors.userCreated = 'Vui lòng chọn người tạo dịch vụ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format data for submission
      const serviceToSubmit = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };
      
      await onSave(serviceToSubmit);
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error("Lỗi khi cập nhật dịch vụ: " + (error.message || "Đã xảy ra lỗi"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tên dịch vụ */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Tên dịch vụ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
      
      {/* Người tạo dịch vụ */}
      <div>
        <label htmlFor="userCreated" className="block text-sm font-medium text-gray-700 mb-1">
          Người tạo dịch vụ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Search className="ml-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email" 
              className="w-full p-2.5 border-none focus:outline-none text-sm"
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setShowUserDropdown(true);
              }}
              onFocus={() => setShowUserDropdown(true)}
            />
          </div>
          {errors.userCreated && <p className="mt-1 text-sm text-red-500">{errors.userCreated}</p>}
          
          {/* Selected user display */}
          {selectedUser && (
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-blue-800">Người tạo đã chọn</h3>
                <button 
                  type="button"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  onClick={() => {
                    setSelectedUser(null);
                    setFormData(prev => ({ ...prev, userCreated: "" }));
                  }}
                >
                  Hủy chọn
                </button>
              </div>
              <div className="bg-white border border-gray-100 rounded-md p-2">
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User dropdown */}
          {showUserDropdown && userSearch && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user._id} 
                      className="p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-sm text-gray-500">
                  Không tìm thấy người dùng
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loại dịch vụ */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Loại dịch vụ <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="Data">Data</option>
          <option value="Cloud">Cloud</option>
          <option value="Network">Network</option>
          <option value="Other">Other</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>

      {/* Mô tả */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Price & Duration row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Giá dịch vụ */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>

        {/* Thời hạn */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Thời hạn (tháng) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
        </div>
      </div>

      {/* Trạng thái */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Tính năng */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tính năng
        </label>
        <div className="flex">
          <input
            type="text"
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
            placeholder="Nhập tính năng"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddFeature();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Feature list */}
        {formData.features.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-2 rounded-md">
                <span className="flex-1 text-sm">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang cập nhật...
            </>
          ) : (
            'Lưu thay đổi'
          )}
        </button>
      </div>
    </form>
  );
};

export default EditServiceModal;