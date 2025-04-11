import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addBusiness } from '../../stores/redux/actions/businessActions';
import addressData from '../../assets/json/Danhsach_diachi_json.json';

export const CreateBusiness = ({ closeModal, businesses, onBusinessCreated }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        mst: "",
        name: "",
        province: "",
        district: "",
        ward: "",
        specificAddress: "",
        address: ""
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProvinces(addressData.data);
    }, []);

    // Update districts when province changes
    useEffect(() => {
        if (formData.province) {
            const selectedProvince = provinces.find(p => p.name === formData.province);
            if (selectedProvince && selectedProvince.level2s) {
                setDistricts(selectedProvince.level2s);
                setFormData(prev => ({
                    ...prev,
                    district: "",
                    ward: ""
                }));
                setWards([]);
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [formData.province, provinces]);

    // Update wards when district changes
    useEffect(() => {
        if (formData.district && districts.length > 0) {
            const selectedDistrict = districts.find(d => d.name === formData.district);
            if (selectedDistrict && selectedDistrict.level3s) {
                setWards(selectedDistrict.level3s);
                setFormData(prev => ({
                    ...prev,
                    ward: ""
                }));
            }
        } else {
            setWards([]);
        }
    }, [formData.district, districts]);

    // Update combined address when any address component changes
    useEffect(() => {
        const { province, district, ward, specificAddress } = formData;
        const addressParts = [];

        if (specificAddress) addressParts.push(specificAddress);
        if (ward) addressParts.push(ward);
        if (district) addressParts.push(district);
        if (province) addressParts.push(province);

        const combinedAddress = addressParts.join(', ');

        setFormData(prev => ({
            ...prev,
            address: combinedAddress
        }));
    }, [formData.province, formData.district, formData.ward, formData.specificAddress]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Basic validation for required fields
        if (!formData.mst || !formData.name || !formData.address) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        if (!formData.province || !formData.district || !formData.ward || !formData.specificAddress) {
            toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
            return;
        }

        // Check if MST already exists
        const mstExists = businesses.some(business => business.mst === formData.mst);
        if (mstExists) {
            toast.error("Mã số thuế đã tồn tại trong hệ thống");
            return;
        }

        // Only send required fields according to backend model
        const newBusiness = {
            mst: formData.mst,
            name: formData.name,
            address: formData.address // Đã được tổng hợp từ các thành phần địa chỉ
        };

        try {
            const createdBusiness = await dispatch(addBusiness(newBusiness));
            toast.success("Tạo doanh nghiệp thành công");
            onBusinessCreated(createdBusiness);
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

                        {/* Address Fields */}
                        <div className="space-y-4">
                            <h3 className="text-md font-medium text-gray-700">Địa chỉ <span className="text-red-500">*</span></h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Province */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Chọn Tỉnh/Thành phố</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.name}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quận/Huyện <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                        disabled={!formData.province}
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.name}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ward */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phường/Xã <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                        disabled={!formData.district}
                                    >
                                        <option value="">Chọn Phường/Xã</option>
                                        {wards.map((ward) => (
                                            <option key={ward.id} value={ward.name}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Specific Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ cụ thể <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="specificAddress"
                                    value={formData.specificAddress}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập số nhà, tên đường, tòa nhà, v.v."
                                    required
                                />
                            </div>

                            {/* Combined Address Preview */}
                            {formData.address && (
                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ đầy đủ:
                                    </label>
                                    <p className="text-sm text-gray-600">{formData.address}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 italic mb-4">
                                Lưu ý: Các thông tin khác như loại dữ liệu, số lượng công việc sẽ được cập nhật tự động khi bạn tạo các task cho doanh nghiệp này.
                            </p>
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