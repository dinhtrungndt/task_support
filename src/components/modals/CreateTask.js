import { X } from 'lucide-react';
import React, { useState } from 'react';

export const CreateTask = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        mst: "",
        name: "",
        address: "",
        connectionType: "",
        installer: "",
        codeData: "",
        typeData: "",
        settingDate: "",
        creator: "",
        status: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-5 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
                <div className='flex items-center'>
                    <h2 className="text-base font-semibold">Create Task</h2>
                    <button className="bg-blue-500 text-white px-6 rounded-md text-sm hover:bg-blue-600 ml-6" onClick={closeModal} >
                        Close
                    </button>
                </div>
                <button onClick={closeModal}>
                    <X size={18} className="cursor-pointer hover:text-red-500" />
                </button>
            </div>
            <div className="mt-3 space-y-2">
                <input type="text" name="mst" placeholder="MST" value={formData.mst} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <input type="text" name="name" placeholder="Tên công ty" value={formData.name} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <input type="text" name="connectionType" placeholder="Loại kết nối" value={formData.connectionType} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <input type="text" name="installer" placeholder="Người lắp đặt" value={formData.installer} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <input type="text" name="codeData" placeholder="Mã dữ liệu" value={formData.codeData} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <select name="typeData" value={formData.typeData} onChange={handleChange} className="w-full p-1.5 border rounded text-xs">
                    <option value="">Chọn loại dữ liệu</option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                </select>
                <input type="date" name="settingDate" value={formData.settingDate} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <input type="text" name="creator" placeholder="Người tạo" value={formData.creator} onChange={handleChange} className="w-full p-1.5 border rounded text-xs" />
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-1.5 border rounded text-xs">
                    <option value="">Chọn trạng thái</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                </select>
            </div>
            <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600 mt-3 w-full">Create</button>
        </div>
    );
};
