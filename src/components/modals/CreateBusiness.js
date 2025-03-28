import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

export const CreateBusiness = ({ closeModal, businesses, onBusinessCreated }) => {
    const [formData, setFormData] = useState({
        mst: "",
        name: "",
        address: "",
        contactPerson: "",
        phone: "",
        email: "",
        PInstaller: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.mst || !formData.name) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const newBusiness = {
            id: formData.mst,
            mst: formData.mst,
            name: formData.name,
            address: formData.address,
            contactPerson: formData.contactPerson || 'N/A',
            phone: formData.phone,
            email: formData.email,
            PInstaller: formData.PInstaller,
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            rejectedTasks: 0,
            dataTypes: [],
            installationHistory: [],
            lastModified: new Date().toISOString()
        };

        onBusinessCreated(newBusiness);
        closeModal();
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
                <div className="p-6">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">MST <span className="text-red-500">*</span></label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty <span className="text-red-500">*</span></label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Nhập địa chỉ"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Người liên hệ</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Người cài đặt</label>
                                <input
                                    type="text"
                                    name="PInstaller"
                                    value={formData.PInstaller}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập tên người cài đặt"
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