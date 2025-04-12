import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, X, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../api/axiosClient';

export const ProfileSetting = ({ darkMode, profileSettings, handleProfileChange, timeZone }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

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
        toast.success('Cập nhật ảnh đại diện thành công');
        handleProfileChange('avatar', response.data.avatar);
      }
    } catch (error) {
      console.error('Upload error:', error);
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
        setSuccessMessage('Thông tin đã được cập nhật thành công!');
        setTimeout(() => setSuccessMessage(null), 3000);

        setOriginalData({ ...profileSettings });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} aria-label="Close message">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        Thông tin người dùng
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center mb-8 pb-6 border-b border-dashed border-gray-200">
        <div className="mr-6 mb-4 md:mb-0 relative group">
          <img
            src={profileSettings.avatar || `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(profileSettings.name || 'User')}`}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full ring-4 ring-blue-100 shadow-md transition duration-300 group-hover:ring-blue-300 object-cover"
          />
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
            {profileSettings.name || 'Your Name'}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
            {profileSettings.jobTitle || profileSettings.role || 'User'} {profileSettings.department && `at ${profileSettings.department}`}
          </p>
          <div className="flex flex-wrap gap-2">
            <label htmlFor="avatar-upload" className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-sm cursor-pointer`}>
              <Camera className="w-4 h-4 mr-2" />
              Đổi ảnh đại diện
            </label>
            {profileSettings.avatar && (
              <button
                onClick={() => handleProfileChange('avatar', null)}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-sm font-medium transition-colors`}
              >
                Xóa
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="fullName" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Tên đầy đủ</label>
          <input
            id="fullName"
            type="text"
            className={`w-full px-4 py-3 rounded-lg ${darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            value={profileSettings.name || ''}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            placeholder="Nhập tên đầy đủ của bạn"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Địa chỉ Email</label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-3 rounded-lg ${darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            value={profileSettings.email || ''}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            className={`w-full px-4 py-3 rounded-lg ${darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            value={profileSettings.phone || ''}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            placeholder="+84 XXX XXX XXX"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="jobTitle" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Vị trí</label>
          <input
            id="jobTitle"
            type="text"
            className={`w-full px-4 py-3 rounded-lg ${darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            value={profileSettings.jobTitle || ''}
            onChange={(e) => handleProfileChange('jobTitle', e.target.value)}
            placeholder="Vị trí của bạn trong công ty"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="department" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Phòng ban</label>
          <select
            id="department"
            className={`w-full px-4 py-3 rounded-lg ${darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-no-repeat bg-right`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            value={profileSettings.department || ''}
            onChange={(e) => handleProfileChange('department', e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="Product Development">Product Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="timeZone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Múi giờ</label>
          <select
            id="timeZone"
            className={`w-full px-4 py-3 rounded-lg ${darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-no-repeat bg-right`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            value={profileSettings.timeZone || ''}
            onChange={(e) => handleProfileChange('timeZone', e.target.value)}
          >
            <option value="">Select Time Zone</option>
            {timeZone && timeZone.map((zone) => (
              <option key={zone.text} value={zone.text}>
                {zone.text}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={saveProfileChanges}
          disabled={!hasChanges || isSaving}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md flex items-center
            ${!hasChanges || isSaving
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
            }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            'Lưu thay đổi'
          )}
        </button>
      </div>
    </div>
  );
};