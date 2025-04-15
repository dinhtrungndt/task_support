import React, { useState, useEffect, useContext } from 'react';
import { Camera, CheckCircle, X, Loader, Mail, Phone, Briefcase, Building, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../api/axiosClient';
import { setCurrentUser } from '../../../stores/redux/actions/userActions';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../../contexts/start/AuthContext';
import secureStorage from '../../../utils/secureDataUtils';

export const ProfileSetting = ({ profileSettings, handleProfileChange, timeZone }) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const { updateUserInfo } = useContext(AuthContext);

  useEffect(() => {
    setOriginalData({ ...profileSettings });
  }, []);

  useEffect(() => {
    if (Object.keys(originalData).length > 0) {
      const hasChanged = Object.keys(profileSettings).some(key =>
        originalData[key] !== profileSettings[key]
      );
      setHasChanges(hasChanged);
    }
  }, [profileSettings, originalData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận các định dạng JPEG, PNG hoặc GIF');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosClient.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        handleProfileChange('avatar', response.data.avatar);
        dispatch(setCurrentUser({ ...profileSettings, avatar: response.data.avatar }));

        const storedUser = secureStorage.getItem("ts");
        if (storedUser) {
          secureStorage.setItem("ts", { ...storedUser, avatar: response.data.avatar });
        }

        toast.success('Cập nhật ảnh đại diện thành công');
      }
    } catch (error) {
      toast.error('Không thể tải lên ảnh đại diện. Vui lòng thử lại sau.');
    } finally {
      setIsUploading(false);
    }
  };

  const saveProfileChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      const response = await axiosClient.put('/profile', profileSettings);

      if (response.data.status === 200) {
        dispatch(setCurrentUser({ ...profileSettings }));

        const storedUser = secureStorage.getItem("ts");
        if (storedUser) {
          secureStorage.setItem("ts", { ...storedUser, ...profileSettings });
        }

        setSuccessMessage('Thông tin đã được cập nhật thành công!');
        setTimeout(() => setSuccessMessage(null), 3000);

        setOriginalData({ ...profileSettings });
        setHasChanges(false);
      }
    } catch (error) {
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-6 p-3 rounded-lg flex items-center justify-between bg-green-50 text-green-700 border border-green-200 animate-fadeIn">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-500 hover:text-green-700"
            aria-label="Close message"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Thông tin người dùng
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center mb-8 pb-6 border-b border-gray-200">
        <div className="mr-6 mb-4 md:mb-0 relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-md transition duration-300 group-hover:ring-indigo-200">
            <img
              src={profileSettings.avatar || `https://ui-avatars.com/api/?background=c7d2fe&color=4f46e5&bold=true&name=${encodeURIComponent(profileSettings.name || 'User')}`}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Camera className="w-8 h-8 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {profileSettings.name || 'Your Name'}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {profileSettings.jobTitle || profileSettings.role || 'User'} {profileSettings.department && `• ${profileSettings.department}`}
          </p>
          <div className="flex flex-wrap gap-2">
            <label htmlFor="avatar-upload" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-sm cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              Đổi ảnh đại diện
            </label>
            {profileSettings.avatar && (
              <button
                onClick={() => handleProfileChange('avatar', null)}
                className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1 inline" />
                Xóa ảnh
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Tên đầy đủ
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="fullName"
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={profileSettings.name || ''}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              placeholder="Nhập tên đầy đủ của bạn"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="email"
              type="email"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={profileSettings.email || ''}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Phone className="h-5 w-5" />
            </div>
            <input
              id="phone"
              type="tel"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={profileSettings.phone || ''}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              placeholder="+84 XXX XXX XXX"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Vị trí
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <input
              id="jobTitle"
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={profileSettings.jobTitle || ''}
              onChange={(e) => handleProfileChange('jobTitle', e.target.value)}
              placeholder="Vị trí của bạn trong công ty"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Phòng ban
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Building className="h-5 w-5" />
            </div>
            <select
              id="department"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
              value={profileSettings.department || ''}
              onChange={(e) => handleProfileChange('department', e.target.value)}
            >
              <option value="">Chọn phòng ban</option>
              <option value="Product Development">Product Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
            Múi giờ
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Globe className="h-5 w-5" />
            </div>
                          <select
              id="timeZone"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
              value={profileSettings.timeZone || ''}
              onChange={(e) => handleProfileChange('timeZone', e.target.value)}
            >
              <option value="">Chọn múi giờ</option>
              {timeZone && timeZone.map((zone) => (
                <option key={zone.text} value={zone.text}>
                  {zone.text}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={saveProfileChanges}
          disabled={!hasChanges || isSaving}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center
            ${!hasChanges || isSaving
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
            }`}
        >
          {isSaving ? (
            <>
              <Loader size={18} className="animate-spin mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <CheckCircle size={18} className="mr-2" />
              Lưu thay đổi
            </>
          )}
        </button>
      </div>
    </div>
  );
}