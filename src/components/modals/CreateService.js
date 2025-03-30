import React, { useState, useContext, useRef, useEffect } from 'react';
import { X, FileText, Plus, CheckCircle, User, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../contexts/start/AuthContext';
import BusinessSelector from '../Business/BusinessSelector';
import { addService } from '../../stores/redux/actions/serviceAction';

const CreateService = ({ closeModal, onServiceCreated }) => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const { user } = auth;
  const isMounted = useRef(true);

  const [service, setService] = useState({
    name: '',
    type: 'Data',
    description: '',
    price: '',
    duration: '',
    status: 'Active',
    features: [],
    userCreated: user?._id || "",
    companyId: ""
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [step, setStep] = useState(1);

  // Set current user as default selected user
  useEffect(() => {
    if (user && service.userCreated === "") {
      setService(prev => ({
        ...prev,
        userCreated: user._id
      }));
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [user, service.userCreated]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({
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

  // Handle business selection
  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setService(prev => ({
      ...prev,
      companyId: business._id
    }));
  };
  
  // Handle clearing business selection
  const handleClearBusinessSelection = () => {
    setSelectedBusiness(null);
    setService(prev => ({
      ...prev,
      companyId: ""
    }));
  };

  // Add feature to the list
  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setService(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  // Remove feature from the list
  const handleRemoveFeature = (index) => {
    setService(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!service.name.trim()) {
      newErrors.name = 'Tên dịch vụ không được để trống';
    }
    
    if (!service.type) {
      newErrors.type = 'Vui lòng chọn loại dịch vụ';
    }
    
    if (service.price === '' || isNaN(service.price) || Number(service.price) < 0) {
      newErrors.price = 'Giá dịch vụ phải là số dương';
    }
    
    if (service.duration === '' || isNaN(service.duration) || Number(service.duration) < 1) {
      newErrors.duration = 'Thời hạn phải là số nguyên dương';
    }
    
    if (!service.companyId) {
      newErrors.companyId = 'Vui lòng chọn doanh nghiệp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format data for submission
      const serviceToSubmit = {
        ...service,
        price: parseFloat(service.price), // Ensure it's a valid number
        duration: parseInt(service.duration, 10), // Ensure it's a valid integer
      };
      
      const createdService = await dispatch(addService(serviceToSubmit));
      
      if (onServiceCreated) {
        onServiceCreated(createdService);
      }
      
      toast.success("Tạo dịch vụ thành công");
      
      // Force reset submitting state and close modal
      setIsSubmitting(false);
      window.setTimeout(() => closeModal(), 500);
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error("Lỗi khi tạo dịch vụ: " + (error.message || "Đã xảy ra lỗi"));
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (!service.companyId) {
      toast.error("Vui lòng chọn doanh nghiệp trước khi tiếp tục");
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-base font-semibold flex items-center">
            {step === 1 ? (
              <>
                <Building className="mr-2" size={18} />
                Bước 1: Chọn doanh nghiệp
              </>
            ) : (
              <>
                <FileText className="mr-2" size={18} />
                Bước 2: Thông tin dịch vụ
              </>
            )}
          </h2>
          <button 
            onClick={() => {
              if (!isSubmitting) {
                closeModal();
              }
            }}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Step Indicator */}
        <div className="bg-blue-50 px-4 py-2">
          <div className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-700'}`}>
              1
            </div>
            <div className={`h-1 flex-1 mx-2 ${step === 1 ? 'bg-blue-200' : 'bg-blue-500'}`}></div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-700'}`}>
              2
            </div>
          </div>
        </div>
        
        {/* Form Body - Made Scrollable */}
        <div className="p-4 overflow-y-auto flex-grow">
          {step === 1 ? (
            <div className="space-y-3">
              {/* Using the Business Selector component */}
              <BusinessSelector
                selectedBusiness={selectedBusiness}
                onBusinessSelect={handleBusinessSelect}
                onClearSelection={handleClearBusinessSelection}
              />
              
              {/* Current user info */}
              <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={14} className="mr-1 text-gray-400" />
                  <span>Người tạo: </span>
                  <span className="font-medium ml-1">
                    {user?.name || 'Không xác định'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Service Details */
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <p className="text-sm font-medium text-gray-700">Doanh nghiệp: <span className="text-blue-600">{selectedBusiness?.name}</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <Building size={12} className="mr-1" />
                    MST: {selectedBusiness?.mst}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Địa chỉ: {selectedBusiness?.address}</p>
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <User size={14} className="mr-1 text-gray-400" />
                  <span>Người tạo: </span>
                  <span className="font-medium ml-1">
                    {user?.name || 'Không xác định'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <FileText className="ml-2 text-gray-400" size={14} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={service.name}
                      onChange={handleChange}
                      placeholder="Nhập tên dịch vụ"
                      className="w-full py-2 px-2 border-none focus:outline-none text-sm"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <Building className="ml-2 text-gray-400" size={14} />
                    <select
                      id="type"
                      name="type"
                      value={service.type}
                      onChange={handleChange}
                      className="w-full py-2 px-2 border-none focus:outline-none text-sm"
                    >
                      <option value="Data">Data</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Network">Network</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <CheckCircle className="ml-2 text-gray-400" size={14} />
                    <select
                      id="status"
                      name="status"
                      value={service.status}
                      onChange={handleChange}
                      className="w-full py-2 px-2 border-none focus:outline-none text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <FileText className="ml-2 text-gray-400" size={14} />
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={service.price}
                      onChange={handleChange}
                      min="0"
                      placeholder="Nhập giá dịch vụ"
                      className="w-full py-2 px-2 border-none focus:outline-none text-sm"
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Thời hạn (tháng) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <FileText className="ml-2 text-gray-400" size={14} />
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={service.duration}
                      onChange={handleChange}
                      min="1"
                      placeholder="Nhập thời hạn dịch vụ"
                      className="w-full py-2 px-2 border-none focus:outline-none text-sm"
                    />
                  </div>
                  {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={service.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả dịch vụ"
                  rows={2}
                />
              </div>
              
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
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Feature list */}
                {service.features.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-gray-50 p-1.5 rounded-md">
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
            </div>
          )}
        </div>
        
        {/* Footer with buttons - Always at bottom */}
        <div className="px-4 py-3 bg-gray-50 flex justify-between border-t mt-auto">
          {step === 1 ? (
            <>
              <button
                onClick={() => {
                  if (!isSubmitting) {
                    closeModal();
                  }
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleNextStep}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                disabled={!selectedBusiness || isSubmitting}
              >
                Tiếp tục
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePrevStep}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting}
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo...
                  </span>
                ) : (
                  "Tạo dịch vụ"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateService;