import React, { useState, useContext, useRef } from 'react';
import { X, FileText, Link, Database, Calendar, User, CheckCircle, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addTask } from '../../stores/redux/actions/taskActions';
import { AuthContext } from '../../contexts/start/AuthContext';
import BusinessSelector from '../Business/BusinessSelector';

export const CreateTask = ({ closeModal }) => {
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const { user } = auth;
    const isMounted = useRef(true);

    const [formData, setFormData] = useState({
        companyId: "",
        companyName: "",
        mst: "",
        address: "",
        connectionType: "",
        installer: "", 
        codeData: "", 
        typeData: "Data",
        installDate: new Date().toISOString().split('T')[0],
        status: "Pending",
        notes: ""
    });

    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBusinessSelect = (business) => {
        setSelectedBusiness(business);
        setFormData(prev => ({
            ...prev,
            companyId: business._id,
            mst: business.mst,
            companyName: business.name,
            address: business.address
        }));
    };

    const handleClearBusinessSelection = () => {
        setSelectedBusiness(null);
        setFormData(prev => ({
            ...prev,
            companyId: "",
            mst: "",
            companyName: "",
            address: ""
        }));
    };

    const handleSubmit = async () => {
        // Validate form data
        if (!formData.companyId) {
            toast.error("Vui lòng chọn doanh nghiệp");
            return;
        }
        
        if (!formData.connectionType) {
            toast.error("Vui lòng chọn loại kết nối");
            return;
        }
        
        if (!formData.status) {
            toast.error("Vui lòng chọn trạng thái");
            return;
        }
        
        if (formData.status === "Rejected" && !formData.notes) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }
        
        // Check if user is logged in
        if (!user || !user._id) {
            toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Make sure we have values for required fields
            const dataToSubmit = {
                ...formData,
                installer: formData.installer || "N/A",
                codeData: formData.codeData || "N/A"
            };
            
            // Pass the user ID directly to the action
            await dispatch(addTask(dataToSubmit, user._id));
            
            toast.success("Tạo công việc thành công!");
            
            // Force reset submitting state and close modal
            setIsSubmitting(false);
            window.setTimeout(() => closeModal(), 500);
            
            return true; // Ensure the function returns something
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Lỗi khi tạo công việc: " + (error.message || "Vui lòng thử lại"));
            setIsSubmitting(false);
            return false;
        }
    };

    const handleNextStep = () => {
        if (!formData.companyId) {
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <h2 className="text-lg font-semibold flex items-center">
                        {step === 1 ? (
                            <>
                                <Building className="mr-2" size={20} />
                                Bước 1: Chọn doanh nghiệp
                            </>
                        ) : (
                            <>
                                <FileText className="mr-2" size={20} />
                                Bước 2: Thông tin công việc
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
                        <X size={20} />
                    </button>
                </div>
                
                {/* Step Indicator */}
                <div className="bg-blue-50 px-6 py-2">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-700'}`}>
                            1
                        </div>
                        <div className={`h-1 flex-1 mx-2 ${step === 1 ? 'bg-blue-200' : 'bg-blue-500'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-700'}`}>
                            2
                        </div>
                    </div>
                </div>
                
                {/* Form Body */}
                <div className="p-6">
                    {step === 1 ? (
                        <div className="space-y-4">
                            {/* Using the Business Selector component */}
                            <BusinessSelector
                                selectedBusiness={selectedBusiness}
                                onBusinessSelect={handleBusinessSelect}
                                onClearSelection={handleClearBusinessSelection}
                            />
                            
                            {/* Current user info */}
                            <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded-md">
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
                        /* Step 2: Task Details */
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-md mb-4">
                                <p className="text-sm font-medium text-gray-700">Doanh nghiệp: <span className="text-blue-600">{formData.companyName}</span></p>
                                <p className="text-xs text-gray-500 mt-1">MST: {formData.mst}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-600">
                                    <User size={14} className="mr-1 text-gray-400" />
                                    <span>Người tạo: </span>
                                    <span className="font-medium ml-1">
                                        {user?.name || 'Không xác định'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại kết nối <span className="text-red-500">*</span></label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <Link className="ml-3 text-gray-400" size={16} />
                                        <select
                                            name="connectionType"
                                            value={formData.connectionType}
                                            onChange={handleChange}
                                            className="w-full py-2.5 px-3 border-none focus:outline-none text-sm"
                                        >
                                            <option value="">Chọn loại kết nối</option>
                                            <option value="Mạng">Mạng</option>
                                            <option value="Data">Data</option>
                                            <option value="Cloud">Cloud</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Người lắp đặt</label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <User className="ml-3 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            name="installer"
                                            placeholder="Nhập tên người lắp đặt (mặc định: N/A)"
                                            value={formData.installer}
                                            onChange={handleChange}
                                            className="w-full py-2.5 px-3 border-none focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã dữ liệu</label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <Database className="ml-3 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            name="codeData"
                                            placeholder="Nhập mã dữ liệu (mặc định: N/A)"
                                            value={formData.codeData}
                                            onChange={handleChange}
                                            className="w-full py-2.5 px-3 border-none focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại dữ liệu</label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <Database className="ml-3 text-gray-400" size={16} />
                                        <select
                                            name="typeData"
                                            value={formData.typeData}
                                            onChange={handleChange}
                                            className="w-full py-2.5 px-3 border-none focus:outline-none text-sm"
                                        >
                                            <option value="Data">Data</option>
                                            <option value="Cloud">Cloud</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày lắp đặt</label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <Calendar className="ml-3 text-gray-400" size={16} />
                                        <input
                                            type="date"
                                            name="installDate"
                                            value={formData.installDate}
                                            onChange={handleChange}
                                            className="w-full py-2.5 px-3 border-none focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <CheckCircle className="ml-3 text-gray-400" size={16} />
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full py-2.5 px-3 border-none focus:outline-none text-sm"
                                        >
                                            <option value="Pending">Đang làm</option>
                                            <option value="Done">Hoàn thành</option>
                                            <option value="Rejected">Từ chối</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {formData.status === "Rejected" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do từ chối <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập lý do từ chối công việc"
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Footer with buttons */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between border-t">
                    {step === 1 ? (
                        <>
                            <button
                                onClick={() => {
                                    if (!isSubmitting) {
                                        closeModal();
                                    }
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                disabled={!selectedBusiness || isSubmitting}
                            >
                                Tiếp tục
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handlePrevStep}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                disabled={isSubmitting}
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang tạo...
                                    </span>
                                ) : (
                                    "Tạo công việc"
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateTask;