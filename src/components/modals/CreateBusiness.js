import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TaskData } from '../../stores/data/task.task';
import { HeaderPages } from '../header';

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
            alert("Vui lòng điền MST và Tên công ty");
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
    };

    return (
            <div className="container mx-auto p-4 pb-0">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">MST</label>
                                <input 
                                    type="text" 
                                    name="mst" 
                                    value={formData.mst} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Tên công ty</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input 
                                type="text" 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Người liên hệ</label>
                                <input 
                                    type="text" 
                                    name="contactPerson" 
                                    value={formData.contactPerson} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Người cài đặt</label>
                                <input 
                                    type="text" 
                                    name="PInstaller" 
                                    value={formData.PInstaller} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                />
                            </div>
                        </div>

                        <button 
                            className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors duration-300 ease-in-out"
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