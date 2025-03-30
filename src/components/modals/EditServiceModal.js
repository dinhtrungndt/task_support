import React, { useState, useEffect, useContext, useRef } from 'react';
import { Plus, X, Search, User, Building, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/start/AuthContext';
import BusinessSelector from '../Business/BusinessSelector';

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
    userCreated: '',
    companyId: ''
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User selection state
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Business selection state
  const [selectedBusiness, setSelectedBusiness] = useState(null);

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
        userCreated: service.userCreated?._id || service.userCreated || '',
        companyId: service.companyId?._id || service.companyId || ''
      });
      
      // Find the user object from the users array
      const userObj = users.find(u => 
        u._id === (service.userCreated?._id || service.userCreated)
      );
      if (userObj) {
        setSelectedUser(userObj);
      }
      
      // Set selected business if available
      if (service.companyId) {
        setSelectedBusiness(
          typeof service.companyId === 'object' ? service.companyId : { _id: service.companyId }
        );
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
  
  // Handle business selection
  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setFormData(prev => ({
      ...prev,
      companyId: business._id
    }));
  };
  
  // Handle clear business selection
  const handleClearBusinessSelection = () => {
    setSelectedBusiness(null);
    setFormData(prev => ({
      ...prev,
      companyId: ""
    }));
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
    
    if (!formData.companyId) {
      newErrors.companyId = 'Vui lòng chọn doanh nghiệp';
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
    <form onSubmit={handleSubmit} className="space-y-3 max-h-[80vh] overflow-y-auto px-1">
      {/* Company selection */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Doanh nghiệp <span className="text-red-500">*</span>
        </label>
        <BusinessSelector
          selectedBusiness={selectedBusiness}
          onBusinessSelect={handleBusinessSelect}
          onClearSelection={handleClearBusinessSelection}
          className="mt-1"
        />
        {errors.companyId && <p className="mt-1 text-xs text-red-500">{errors.companyId}</p>}
      </div>
      
      {/* Tên dịch vụ */}
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
          Tên dịch vụ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Loại dịch vụ */}
      <div>
        <label htmlFor="type" className="block text-xs font-medium text-gray-700 mb-1">
          Loại dịch vụ <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`w-full p-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="Data">Data</option>
          <option value="Cloud">Cloud</option>
          <option value="Network">Network</option>
          <option value="Other">Other</option>
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
      </div>

      {/* Mô tả */}
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Price & Duration row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Giá dịch vụ */}
        <div>
          <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1">
            Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            className={`w-full p-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
        </div>

        {/* Thời hạn */}
        <div>
          <label htmlFor="duration" className="block text-xs font-medium text-gray-700 mb-1">
            Thời hạn (tháng) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className={`w-full p-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
        </div>
      </div>

      {/* Trạng thái */}
      <div>
        <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Tính năng */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Tính năng
        </label>
        <div className="flex">
          <input
            type="text"
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
            placeholder="Nhập tính năng"
            className="flex-1 p-1.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="px-2 py-1.5 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus size={14} />
          </button>
        </div>
        
        {/* Feature list */}
        {formData.features.length > 0 && (
          <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-1 rounded-md">
                <span className="flex-1 text-xs">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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