import React, { useState } from 'react';
import { Info, Calendar, AlertCircle, ChevronRight } from 'lucide-react';

export const MoreDetailsModalBusiness = ({ business }) => {
  const [activeTab, setActiveTab] = useState('Tổng quan');

  if (!business) return null;

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <Info size={16} className="mr-1.5" />
          Thông tin doanh nghiệp
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Tên doanh nghiệp</p>
              <p className="text-sm font-medium text-gray-900">{business.name || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Mã số thuế</p>
              <p className="text-sm font-medium text-gray-900">{business.mst || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Địa chỉ</p>
              <p className="text-sm font-medium text-gray-900">{business.address || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Người liên hệ</p>
              <p className="text-sm font-medium text-gray-900">{business.contactPerson || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Điện thoại</p>
              <p className="text-sm font-medium text-gray-900">{business.phone || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{business.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
          <Calendar size={16} className="mr-1.5" />
          Thống kê cài đặt
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Tổng lần cài đặt</p>
            <p className="text-2xl font-semibold text-blue-600">{business.totalTasks || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Hoàn thành</p>
            <p className="text-2xl font-semibold text-green-600">{business.completedTasks || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Đang cài đặt</p>
            <p className="text-2xl font-semibold text-amber-600">{business.pendingTasks || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Từ chối</p>
            <p className="text-2xl font-semibold text-red-600">{business.rejectedTasks || 0}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Loại dữ liệu</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {business.dataTypes && business.dataTypes.length > 0 ? 
                business.dataTypes.map((type, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                  >
                    {type}
                  </span>
                )) : 
                <span className="text-sm text-gray-500">Chưa có dữ liệu</span>
              }
            </div>
          </div>
          <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Cập nhật cuối</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(business.lastModified)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstallationHistoryTab = () => {
    // Make sure installation history exists and is an array
    const history = Array.isArray(business.installationHistory) ? business.installationHistory : [];
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b">Ngày cài</th>
                  <th className="px-4 py-3 border-b">Loại dữ liệu</th>
                  <th className="px-4 py-3 border-b">Người cài</th>
                  <th className="px-4 py-3 border-b">Loại kết nối</th>
                  <th className="px-4 py-3 border-b">Trạng thái</th>
                  <th className="px-4 py-3 border-b">Mã Data</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-xs text-gray-900">{formatDate(record.date)}</td>
                    <td className="px-4 py-3 border-b text-xs text-gray-900">{record.type || 'N/A'}</td>
                    <td className="px-4 py-3 border-b text-xs text-gray-900">{record.installer || 'N/A'}</td>
                    <td className="px-4 py-3 border-b text-xs text-gray-900">{record.connectionType || 'N/A'}</td>
                    <td className="px-4 py-3 border-b text-xs">
                      <span className={`
                        inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${record.status === 'Done' ? 'bg-green-100 text-green-800' : 
                          record.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'}
                      `}>
                        {record.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b text-xs text-gray-900">{record.notes || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
              <Calendar size={24} />
            </div>
            <p className="text-gray-500 text-sm">Chưa có lịch sử cài đặt</p>
          </div>
        )}
      </div>
    );
  };

  const renderProblemAnalysisTab = () => {
    // Handle missing or invalid installation history
    const history = Array.isArray(business.installationHistory) ? business.installationHistory : [];
    const rejectedTasks = history.filter(record => record.status === 'Rejected');
    
    const problemTypes = {};
    rejectedTasks.forEach(task => {
      if (task.notes) {
        const problemKey = task.notes.toLowerCase();
        problemTypes[problemKey] = (problemTypes[problemKey] || 0) + 1;
      }
    });

    return (
      <div className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
            <AlertCircle size={16} className="mr-1.5" />
            Thống kê lỗi
          </h3>
          
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Tổng số lần từ chối</span>
              <span className="text-xl font-bold text-red-600">{rejectedTasks.length}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
              <div 
                className="h-2 bg-red-600 rounded-full" 
                style={{ width: `${(rejectedTasks.length / (business.totalTasks || 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {((rejectedTasks.length / (business.totalTasks || 1)) * 100).toFixed(1)}% tổng số lần cài đặt
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Lỗi thường gặp</h3>
          
          {Object.entries(problemTypes).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(problemTypes)
                .sort((a, b) => b[1] - a[1])
                .map(([problem, count], index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700">{problem}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-1">{count}</span>
                      <span className="text-xs text-gray-500">lần</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                <Info size={24} />
              </div>
              <p className="text-gray-500 text-sm">Không có thông tin lỗi</p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h3 className="text-sm font-medium text-amber-800 mb-3">Khuyến nghị xử lý</h3>
          <ul className="space-y-2">
            <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
              <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Xem lại quy trình cài đặt và đảm bảo tuân thủ các hướng dẫn kỹ thuật</span>
            </li>
            <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
              <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Cung cấp đào tạo bổ sung cho người cài đặt về các vấn đề thường gặp</span>
            </li>
            <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
              <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Kiểm tra tương thích của thiết bị và loại kết nối trước khi cài đặt</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'Tổng quan' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('Tổng quan')}
          >
            <Info size={16} className="mr-1.5" />
            Tổng quan
          </button>
          <button
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'Lịch sử' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('Lịch sử')}
          >
            <Calendar size={16} className="mr-1.5" />
            Lịch sử cài đặt
          </button>
          <button
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'Lý do' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('Lý do')}
          >
            <AlertCircle size={16} className="mr-1.5" />
            Phân tích lỗi
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'Tổng quan' && renderOverviewTab()}
        {activeTab === 'Lịch sử' && renderInstallationHistoryTab()}
        {activeTab === 'Lý do' && renderProblemAnalysisTab()}
      </div>
    </div>
  );
};

export default MoreDetailsModalBusiness;