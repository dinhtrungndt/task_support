import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import addressData from '../../../assets/json/Danhsach_diachi_json.json';

export const EditBusinessModal = ({
  business,
  onClose,
  onSave
}) => {
  const [editedBusiness, setEditedBusiness] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm các state cho địa chỉ đa cấp
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressInitialized, setAddressInitialized] = useState(false);

  useEffect(() => {
    setProvinces(addressData.data);
}, []);

  useEffect(() => {
    if (business) {
      // Initialize the form with the business data
      setEditedBusiness({
        ...business,
        province: "",
        district: "",
        ward: "",
        specificAddress: ""
      });
    }
  }, [business]);

  // Phân tích địa chỉ hiện tại để tách thành các thành phần
  useEffect(() => {
    if (editedBusiness?.address && provinces.length > 0 && !addressInitialized) {
      // Split address into parts (assuming format: 'specific, ward, district, province')
      const addressParts = editedBusiness.address.split(', ').filter(part => part.trim());

      // Reverse to get from highest level (province) to lowest (specific)
      const reversedParts = [...addressParts].reverse();

      if (reversedParts.length >= 3) {
        // Try to find province
        const province = provinces.find(p => p.name === reversedParts[0]);

        if (province) {
          setEditedBusiness(prev => ({...prev, province: province.name}));

          // Try to find district
          const district = province.level2s.find(d => d.name === reversedParts[1]);

          if (district) {
            setDistricts(province.level2s);
            setEditedBusiness(prev => ({...prev, district: district.name}));

            // Try to find ward
            const ward = district.level3s.find(w => w.name === reversedParts[2]);

            if (ward) {
              setWards(district.level3s);
              setEditedBusiness(prev => ({...prev, ward: ward.name}));

              // Get specific address (remaining parts)
              const specificParts = addressParts.slice(0, addressParts.length - 3);
              const specificAddress = specificParts.join(', ');

              setEditedBusiness(prev => ({...prev, specificAddress}));
            }
          }
        }
      } else {
        // If address format doesn't match expected structure, just use it as specificAddress
        setEditedBusiness(prev => ({...prev, specificAddress: editedBusiness.address}));
      }

      setAddressInitialized(true);
    }
  }, [editedBusiness?.address, provinces, addressInitialized]);

  // Update districts when province changes
  useEffect(() => {
    if (editedBusiness?.province) {
      const selectedProvince = provinces.find(p => p.name === editedBusiness.province);
      if (selectedProvince && selectedProvince.level2s) {
        setDistricts(selectedProvince.level2s);

        // Only reset district and ward if this isn't part of initialization
        if (addressInitialized && !selectedProvince.level2s.some(d => d.name === editedBusiness.district)) {
          setEditedBusiness(prev => ({
            ...prev,
            district: "",
            ward: ""
          }));
          setWards([]);
        }
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [editedBusiness?.province, provinces, addressInitialized]);

  // Update wards when district changes
  useEffect(() => {
    if (editedBusiness?.district && districts.length > 0) {
      const selectedDistrict = districts.find(d => d.name === editedBusiness.district);
      if (selectedDistrict && selectedDistrict.level3s) {
        setWards(selectedDistrict.level3s);

        // Only reset ward if this isn't part of initialization
        if (addressInitialized && !selectedDistrict.level3s.some(w => w.name === editedBusiness.ward)) {
          setEditedBusiness(prev => ({
            ...prev,
            ward: ""
          }));
        }
      }
    } else {
      setWards([]);
    }
  }, [editedBusiness?.district, districts, addressInitialized]);

  // Update combined address when any address component changes
  useEffect(() => {
    if (editedBusiness && addressInitialized) {
      const { province, district, ward, specificAddress } = editedBusiness;
      const addressParts = [];

      if (specificAddress) addressParts.push(specificAddress);
      if (ward) addressParts.push(ward);
      if (district) addressParts.push(district);
      if (province) addressParts.push(province);

      const combinedAddress = addressParts.join(', ');

      setEditedBusiness(prev => ({
        ...prev,
        address: combinedAddress
      }));
    }
  }, [editedBusiness?.province, editedBusiness?.district, editedBusiness?.ward, editedBusiness?.specificAddress, addressInitialized]);

  const handleInputChange = (e) => {
    if (editedBusiness) {
      setEditedBusiness({
        ...editedBusiness,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = async () => {
    if (!editedBusiness) return;

    // Validate required fields
    if (!editedBusiness.mst || !editedBusiness.name || !editedBusiness.address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate address components
    if (!editedBusiness.province || !editedBusiness.district || !editedBusiness.ward || !editedBusiness.specificAddress) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      setIsSubmitting(true);

      if (!editedBusiness._id) {
        toast.error("Lỗi: ID doanh nghiệp không xác định");
        return;
      }

      // Only pass fields that are accepted by the backend API
      const businessToUpdate = {
        _id: editedBusiness._id,
        mst: editedBusiness.mst,
        name: editedBusiness.name,
        address: editedBusiness.address
      };

      await onSave(businessToUpdate);
    } catch (error) {
      toast.error("Lỗi khi cập nhật: " + (error.message || "Đã xảy ra lỗi"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editedBusiness) return null;

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-medium">Chỉnh sửa thông tin doanh nghiệp</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MST <span className="text-gray-400 text-xs">(không thể thay đổi)</span>
            </label>
            <input
              type="text"
              name="mst"
              value={editedBusiness.mst || ''}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên công ty <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={editedBusiness.name || ''}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên công ty"
              required
            />
          </div>
        </div>

        {/* Address Fields */}
        <div className="mt-5 space-y-4">
          <h3 className="text-md font-medium text-gray-700">Địa chỉ <span className="text-red-500">*</span></h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                value={editedBusiness.province || ''}
                onChange={handleInputChange}
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
                value={editedBusiness.district || ''}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                disabled={!editedBusiness.province}
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
                value={editedBusiness.ward || ''}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                disabled={!editedBusiness.district}
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
              value={editedBusiness.specificAddress || ''}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập số nhà, tên đường, tòa nhà, v.v."
              required
            />
          </div>

          {/* Combined Address Preview */}
          {editedBusiness.address && (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ đầy đủ:
              </label>
              <p className="text-sm text-gray-600">{editedBusiness.address}</p>
            </div>
          )}
        </div>

        {/* Read-only information */}
        {editedBusiness.typeData && editedBusiness.typeData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin khác (chỉ đọc)</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Loại dữ liệu</p>
                <div className="flex flex-wrap gap-1">
                  {editedBusiness.typeData.map((type, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Tổng công việc</p>
                  <p className="text-sm font-medium">{editedBusiness.totalTasks || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Hoàn thành</p>
                  <p className="text-sm font-medium text-green-600">{editedBusiness.completedTasks || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Đang làm</p>
                  <p className="text-sm font-medium text-amber-600">{editedBusiness.pendingTasks || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Từ chối</p>
                  <p className="text-sm font-medium text-red-600">{editedBusiness.rejectedTasks || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Lưu ý: Các trường khác như loại dữ liệu và thống kê công việc sẽ được cập nhật tự động khi bạn thêm hoặc cập nhật các task.
          </p>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu...
            </span>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
};

export default EditBusinessModal;