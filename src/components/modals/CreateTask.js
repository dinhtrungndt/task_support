import { X, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';

export const CreateTask = ({ closeModal }) => {
    const dispatch = useDispatch();
    const { businesses } = useSelector(state => state.business);
    
    const [formData, setFormData] = useState({
        mst: "",
        name: "",
        address: "",
        connectionType: "",
        PInstaller: "",
        codeData: "",
        typeData: "",
        AtSetting: "",
        userId: { name: "" },
        status: "",
        cancellationReason: ""
    });

    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [businessSearch, setBusinessSearch] = useState('');
    const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);

    useEffect(() => {
        if (!businesses.length) {
            dispatch(fetchBusinesses()); 
        }
    }, [dispatch, businesses.length]);

    useEffect(() => {
        if (businessSearch.trim() === '') {
            setFilteredBusinesses(businesses);
        } else {
            const searchTerm = businessSearch.toLowerCase().trim();
            const filtered = businesses.filter(business =>
                business.name.toLowerCase().includes(searchTerm) ||
                business.mst.toLowerCase().includes(searchTerm)
            );
            setFilteredBusinesses(filtered);
        }
    }, [businessSearch, businesses]);

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
            mst: business.mst,
            name: business.name,
            address: business.address
        }));
        setBusinessSearch('');
    };

    const handleSubmit = () => {
        if (!formData.mst || !formData.name || !formData.status) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const newTask = {
            ...formData,
            _id: Date.now().toString(),
            userId: {
                name: formData.userId.name || "Current User"
            }
        };

        console.log('New Task:', newTask);
        
        closeModal();
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-5 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-base font-semibold">Thêm dịch vụ</h2>
                <button onClick={closeModal}>
                    <X size={18} className="cursor-pointer hover:text-red-500" />
                </button>
            </div>

            {/* Business Selection Section */}
            <div className="mt-3 mb-3 border-b pb-3">
                <h3 className="text-xs font-semibold mb-2">Chọn doanh nghiệp</h3>
                <div className="flex items-center border rounded mb-2">
                    <Search className="ml-2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm doanh nghiệp" 
                        className="w-full p-1.5 text-xs focus:outline-none"
                        value={businessSearch}
                        onChange={(e) => setBusinessSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-32 overflow-y-auto border rounded">
                    {filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((business) => (
                            <div 
                                key={business.id} 
                                className={`p-2 text-xs cursor-pointer hover:bg-gray-100 
                                    ${selectedBusiness?.id === business.id ? 'bg-blue-100' : ''}`}
                                onClick={() => handleBusinessSelect(business)}
                            >
                                <div className="flex justify-between">
                                    <span>{business.name}</span>
                                    <span className="text-gray-500">{business.mst}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-xs text-gray-500 text-center">
                            Không tìm thấy doanh nghiệp
                        </div>
                    )}
                </div>
            </div>

            {/* Task Creation Form */}
            <div className="space-y-2">
                <input 
                    type="text" 
                    name="mst" 
                    placeholder="MST" 
                    value={formData.mst} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                    readOnly
                />
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Tên công ty" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                    readOnly
                />
                <input 
                    type="text" 
                    name="address" 
                    placeholder="Địa chỉ" 
                    value={formData.address} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                    readOnly
                />
                <select 
                    name="connectionType" 
                    value={formData.connectionType} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs"
                >
                    <option value="">Chọn loại kết nối</option>
                    <option value="Fiber">Fiber</option>
                    <option value="Cable">Cable</option>
                    <option value="Wireless">Wireless</option>
                </select>
                <input 
                    type="text" 
                    name="PInstaller" 
                    placeholder="Người lắp đặt" 
                    value={formData.PInstaller} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                />
                <input 
                    type="text" 
                    name="codeData" 
                    placeholder="Mã dữ liệu" 
                    value={formData.codeData} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                />
                <select 
                    name="typeData" 
                    value={formData.typeData} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs"
                >
                    <option value="">Chọn loại dữ liệu</option>
                    <option value="Data">Data</option>
                    <option value="Cloud">Cloud</option>
                </select>
                <input 
                    type="date" 
                    name="AtSetting" 
                    value={formData.AtSetting} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                />
                <input 
                    type="text" 
                    name="userId.name" 
                    placeholder="Người tạo" 
                    value={formData.userId.name} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs" 
                />
                <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    className="w-full p-1.5 border rounded text-xs"
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="Done">Hoàn thành</option>
                    <option value="Pending">Đang làm</option>
                    <option value="Rejected">Từ chối</option>
                </select>

                {formData.status === "Rejected" && (
                    <textarea 
                        name="cancellationReason"
                        value={formData.cancellationReason}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-xs"
                        placeholder="Nhập lý do hủy"
                    />
                )}
            </div>
            <button 
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600 mt-3 w-full"
                onClick={handleSubmit}
            >
                Tạo công việc
            </button>
        </div>
    );
};
