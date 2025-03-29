import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addBusiness } from '../../stores/redux/actions/businessActions';

export const CreateBusiness = ({ closeModal, businesses, onBusinessCreated }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        mst: "",
        name: "",
        address: "",
        connectionType: "",
        PInstaller: "",
        codeData: "",
        typeData: "Data", 
        AtSetting: new Date().toISOString().split('T')[0],
        contactPerson: "",
        phone: "",
        email: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.mst || !formData.name || !formData.address || 
            !formData.connectionType || !formData.PInstaller || 
            !formData.codeData || !formData.typeData || !formData.AtSetting) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        const mstExists = businesses.some(business => business.mst === formData.mst);
        if (mstExists) {
            toast.error("Mã số thuế đã tồn tại trong hệ thống");
            return;
        }

        const newBusiness = {
            mst: formData.mst,
            name: formData.name,
            address: formData.address,
            connectionType: formData.connectionType,
            PInstaller: formData.PInstaller,
            codeData: formData.codeData,
            typeData: formData.typeData,
            AtSetting: formData.AtSetting,
            contactPerson: formData.contactPerson || '',
            phone: formData.phone || '',
            email: formData.email || '',
            dataTypes: [],
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            rejectedTasks: 0,
            installationHistory: [{
                date: formData.AtSetting,
                type: formData.typeData,
                installer: formData.PInstaller,
                connectionType: formData.connectionType,
                status: 'Pending',
                notes: ''
            }]
        };
        console.log("New Business Data:", newBusiness);

        try {
            await dispatch(addBusiness(newBusiness));
            toast.success("Tạo doanh nghiệp thành công");
            onBusinessCreated(newBusiness);
            closeModal();
        } catch (error) {
            toast.error("Lỗi khi thêm doanh nghiệp: " + (error.message || "Đã xảy ra lỗi"));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <h2 className="text-lg font-semibold">Tạo doanh nghiệp mới</h2>
                    <button 
                        onClick={closeModal}
                        className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Form Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    MST <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="mst"
                                    value={formData.mst}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập mã số thuế"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên công ty <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập tên công ty"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Nhập địa chỉ"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại dịch vụ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="connectionType"
                                    value={formData.connectionType}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập loại dịch vụ"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Người cài đặt <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="PInstaller"
                                    value={formData.PInstaller}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập tên người cài đặt"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã dữ liệu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="codeData"
                                    value={formData.codeData}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập mã dữ liệu"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại dữ liệu <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="typeData"
                                    value={formData.typeData}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                >
                                    <option value="Data">Data</option>
                                    <option value="Cloud">Cloud</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày cài đặt <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="AtSetting"
                                        value={formData.AtSetting}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                                        required
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Thông tin thêm */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Thông tin bổ sung</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Người liên hệ
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Nhập tên người liên hệ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập email"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer with buttons */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        onClick={closeModal}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        onClick={handleSubmit}
                    >
                        Tạo doanh nghiệp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBusiness;