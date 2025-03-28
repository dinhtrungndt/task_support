import React, { useState } from 'react';
import { Building, FileText, MapPin, Calendar, User, Link, Database, Clock, CheckCircle, XCircle, AlertTriangle, BarChart, Info } from 'lucide-react';

const MoreDetailsModal = ({ task }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  if (!task) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  // Safely get installation data
  const getInstallationData = (property, defaultValue = 'N/A') => {
    if (!task.installationHistory || !task.installationHistory[0]) {
      return defaultValue;
    }
    return task.installationHistory[0][property] || defaultValue;
  };
  
  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckCircle size={14} className="mr-1.5" />
            Hoàn thành
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            <Clock size={14} className="mr-1.5" />
            Đang làm
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            <XCircle size={14} className="mr-1.5" />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Building size={16} className="mr-1.5 text-gray-500" />
          Thông tin doanh nghiệp
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Tên doanh nghiệp</p>
            <p className="text-sm font-medium mt-1">{task.name || 'N/A'}</p>
          </div>
          
          <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Mã số thuế</p>
            <p className="text-sm font-medium mt-1">{task.mst || 'N/A'}</p>
          </div>
          
          <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm md:col-span-2">
            <p className="text-xs text-gray-500">Địa chỉ</p>
            <div className="flex items-start mt-1">
              <MapPin size={14} className="text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{task.address || 'Chưa có địa chỉ'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Status */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <FileText size={16} className="mr-1.5 text-gray-500" />
            Tình trạng công việc
          </h3>
          {getStatusBadge(getInstallationData('status'))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-r border-gray-100 pr-4">
            <p className="text-xs text-gray-500">Ngày lắp đặt</p>
            <p className="text-sm font-medium mt-1 flex items-center">
              <Calendar size={14} className="text-gray-400 mr-1.5" />
              {formatDate(getInstallationData('date'))}
            </p>
          </div>
          
          <div className="border-r border-gray-100 pr-4">
            <p className="text-xs text-gray-500">Người cài đặt</p>
            <p className="text-sm font-medium mt-1 flex items-center">
              <User size={14} className="text-gray-400 mr-1.5" />
              {task.PInstaller || 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500">Người lắp đặt</p>
            <p className="text-sm font-medium mt-1 flex items-center">
              <User size={14} className="text-gray-400 mr-1.5" />
              {getInstallationData('installer')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Connection Details */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Link size={16} className="mr-1.5 text-gray-500" />
          Chi tiết kết nối
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-r border-gray-100 pr-4">
            <p className="text-xs text-gray-500">Loại kết nối</p>
            <p className="text-sm font-medium mt-1">{task.connectionType || 'N/A'}</p>
          </div>
          
          <div className="border-r border-gray-100 pr-4">
            <p className="text-xs text-gray-500">Loại dữ liệu</p>
            <p className="text-sm font-medium mt-1 flex items-center">
              <Database size={14} className="text-gray-400 mr-1.5" />
              {getInstallationData('type')}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500">Mã dữ liệu</p>
            <p className="text-sm font-medium mt-1">{task.codeData || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Rejection Reason - only show if status is Rejected */}
      {getInstallationData('status') === 'Rejected' && getInstallationData('notes') && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
            <AlertTriangle size={16} className="mr-1.5 text-red-500" />
            Lý do từ chối
          </h3>
          <p className="text-sm bg-white p-3 border border-red-100 rounded-md">
            {getInstallationData('notes')}
          </p>
        </div>
      )}
    </div>
  );
  
  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Clock size={16} className="mr-1.5 text-gray-500" />
            Lịch sử hoạt động
          </h3>
        </div>
        
        <div className="p-5">
          {task.installationHistory && task.installationHistory.length > 0 ? (
            <div className="relative">
              {/* Timeline connector line */}
              <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-200"></div>
              
              <ul className="space-y-5">
                {task.installationHistory.map((record, index) => (
                  <li key={index} className="relative pl-10">
                    {/* Timeline node */}
                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      record.status === 'Done' ? 'bg-green-100 text-green-600' :
                      record.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {record.status === 'Done' ? <CheckCircle size={16} /> :
                       record.status === 'Pending' ? <Clock size={16} /> :
                       <XCircle size={16} />}
                    </div>
                    
                    {/* Content */}
                    <div className="rounded-md border border-gray-200 p-3 bg-white">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">
                          {record.status === 'Done' ? 'Hoàn thành công việc' :
                           record.status === 'Pending' ? 'Đang xử lý' :
                           'Từ chối công việc'}
                        </h4>
                        <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <User size={14} className="mr-1.5 text-gray-400" />
                          <span>Người thực hiện: {record.installer || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Database size={14} className="mr-1.5 text-gray-400" />
                          <span>Loại dữ liệu: {record.type || 'N/A'}</span>
                        </div>
                      </div>
                      
                      {record.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                          <p className="text-gray-500 font-medium mb-1">Ghi chú:</p>
                          <p>{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Clock size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Chưa có lịch sử hoạt động</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <BarChart size={16} className="mr-1.5 text-gray-500" />
          Thống kê và phân tích
        </h3>
        
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
            <BarChart size={28} />
          </div>
          <p className="text-sm text-gray-500 text-center mb-2">
            Tính năng phân tích chi tiết đang được phát triển
          </p>
          <p className="text-xs text-gray-400 text-center max-w-md">
            Trong tương lai, tính năng này sẽ cung cấp phân tích chi tiết về hiệu suất, thời gian xử lý, và so sánh với các công việc tương tự.
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      {/* Task Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{task.name || 'N/A'}</h2>
          {getStatusBadge(getInstallationData('status'))}
        </div>
        <p className="text-sm text-blue-100 mt-1 flex items-center">
          <MapPin size={14} className="mr-1.5" />
          {task.address || 'Chưa có địa chỉ'}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <FileText size={16} className="mr-1.5" />
            Chi tiết
          </button>
          <button
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={16} className="mr-1.5" />
            Lịch sử
          </button>
          <button
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analytics' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart size={16} className="mr-1.5" />
            Phân tích
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default MoreDetailsModal;