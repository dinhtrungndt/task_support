import React, { useState, useEffect } from 'react';
import { Building, FileText, MapPin, Calendar, User, Link, Database, Clock, CheckCircle, XCircle, AlertTriangle, BarChart, Info } from 'lucide-react';
import { useSelector } from 'react-redux';

const MoreDetailsModal = ({ task }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { users } = useSelector(state => state.users || { users: [] });
  const [taskCreator, setTaskCreator] = useState(null);

  useEffect(() => {
    // Find the user who created this task
    if (task?.userAdd && users?.length) {
      const creator = users.find(user => user.id === task.userAdd);
      setTaskCreator(creator);
    } else if (task?.userAdd && typeof task.userAdd === 'object') {
      // If userAdd is already an object with user data
      setTaskCreator(task.userAdd);
    }
  }, [task, users]);

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

  // Get creator name safely
  const getCreatorName = () => {
    if (taskCreator) {
      return taskCreator.name || taskCreator.email || 'Người dùng';
    }

    if (typeof task.userAdd === 'object' && task.userAdd !== null) {
      return task.userAdd.name || task.userAdd.email || 'Người dùng';
    }

    // If userAdd is a string (ID)
    return typeof task.userAdd === 'string' ? task.userAdd : 'Người dùng';
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Hoàn thành
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            <Clock size={12} className="mr-1" />
            Đang làm
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircle size={12} className="mr-1" />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-4">
      {/* Quick Info Bar */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-white border border-gray-200 rounded-md p-2 text-center">
          <p className="text-xs text-gray-500">Ngày lắp đặt</p>
          <p className="text-xs font-medium">{formatDate(task.installDate)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-2 text-center">
          <p className="text-xs text-gray-500">Người lắp đặt</p>
          <p className="text-xs font-medium">{task.installer || 'N/A'}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-2 text-center">
          <p className="text-xs text-gray-500">Loại dữ liệu</p>
          <p className="text-xs font-medium">{task.typeData || 'N/A'}</p>
        </div>
      </div>

      {/* Creator Information */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <h3 className="text-xs font-medium text-blue-800 mb-2 flex items-center">
          <User size={14} className="mr-1 text-blue-500" />
          Người tạo task
        </h3>

        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
          <p className="text-xs font-medium">
            {getCreatorName()}
          </p>
          {taskCreator?.email && (
            <p className="text-xs text-gray-500 mt-0.5">{taskCreator.email}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">
            Ngày tạo: {formatDate(task.createdAt)}
          </p>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
        <h3 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
          <Building size={14} className="mr-1 text-gray-500" />
          Thông tin doanh nghiệp
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Tên doanh nghiệp</p>
            <p className="text-xs font-medium mt-0.5">{task.companyId.name || 'N/A'}</p>
          </div>

          <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Mã số thuế</p>
            <p className="text-xs font-medium mt-0.5">{task.companyId.mst || 'N/A'}</p>
          </div>

          <div className="col-span-2 bg-white p-2 rounded-md border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Địa chỉ</p>
            <div className="flex items-start mt-0.5">
              <MapPin size={12} className="text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{task.companyId.address || 'Chưa có địa chỉ'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <h3 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
          <Link size={14} className="mr-1 text-gray-500" />
          Chi tiết kết nối
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">Loại kết nối</p>
            <p className="text-xs font-medium mt-0.5">{task.connectionType || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Loại dữ liệu</p>
            <p className="text-xs font-medium mt-0.5 flex items-center">
              <Database size={12} className="text-gray-400 mr-1" />
              {task.typeData || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Mã dữ liệu</p>
            <p className="text-xs font-medium mt-0.5">{task.codeData || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Rejection Reason - only show if status is Rejected */}
      {task.status === 'Rejected' && task.notes && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
          <h3 className="text-xs font-medium text-red-800 mb-1.5 flex items-center">
            <AlertTriangle size={14} className="mr-1 text-red-500" />
            Lý do từ chối
          </h3>
          <p className="text-xs bg-white p-2 border border-red-100 rounded-md">
            {task.notes}
          </p>
        </div>
      )}

      {/* Last Modified Info */}
      <div className="mt-2 text-xs text-gray-500 flex justify-end">
        <Clock size={12} className="mr-1" />
        Cập nhật lần cuối: {formatDate(task.lastModified)}
      </div>
    </div>
  );

  const renderHistoryTab = () => {
    // Create a simulated history based on the task's status
    const simulatedHistory = [
      {
        status: task.status || 'Pending',
        date: task.lastModified || task.installDate || task.createdAt || new Date().toISOString(),
        installer: task.installer || 'N/A',
        type: task.typeData || 'N/A',
        notes: task.notes || '',
        user: getCreatorName()
      }
    ];

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-xs font-medium text-gray-900 flex items-center">
              <Clock size={14} className="mr-1 text-gray-500" />
              Lịch sử hoạt động
            </h3>
          </div>

          <div className="p-3">
            {simulatedHistory.length > 0 ? (
              <div className="relative">
                {/* Timeline connector line */}
                <div className="absolute top-0 left-3 bottom-0 w-0.5 bg-gray-200"></div>

                <ul className="space-y-3">
                  {simulatedHistory.map((record, index) => (
                    <li key={index} className="relative pl-8">
                      {/* Timeline node */}
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        record.status === 'Done' ? 'bg-green-100 text-green-600' :
                        record.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {record.status === 'Done' ? <CheckCircle size={12} /> :
                         record.status === 'Pending' ? <Clock size={12} /> :
                         <XCircle size={12} />}
                      </div>

                      {/* Content */}
                      <div className="rounded-md border border-gray-200 p-2 bg-white">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-medium">
                            {record.status === 'Done' ? 'Hoàn thành công việc' :
                             record.status === 'Pending' ? 'Đang xử lý' :
                             'Từ chối công việc'}
                          </h4>
                          <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                        </div>

                        <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <User size={12} className="mr-1 text-gray-400" />
                            <span className="truncate">Người thực hiện: {record.installer || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <User size={12} className="mr-1 text-gray-400" />
                            <span className="truncate">Người tạo: {record.user}</span>
                          </div>
                          <div className="flex items-center">
                            <Database size={12} className="mr-1 text-gray-400" />
                            <span className="truncate">Loại: {record.type || 'N/A'}</span>
                          </div>
                        </div>

                        {record.notes && (
                          <div className="mt-1 p-1.5 bg-gray-50 rounded border border-gray-100 text-xs">
                            <p className="text-gray-500 text-xs mb-0.5">Ghi chú:</p>
                            <p className="text-xs">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="py-6 text-center">
                <Clock size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-xs">Chưa có lịch sử</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="flex items-center mb-1">
            <Info size={14} className="text-blue-500 mr-1 flex-shrink-0" />
            <h3 className="text-xs font-medium text-blue-800">Lưu ý</h3>
          </div>
          <p className="text-xs text-blue-700">
            Lịch sử hiển thị dựa trên trạng thái hiện tại. Chi tiết hơn sẽ được cập nhật trong phiên bản sau.
          </p>
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <h3 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
          <BarChart size={14} className="mr-1 text-gray-500" />
          Thống kê và phân tích
        </h3>

        <div className="p-4 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-2">
            <BarChart size={20} />
          </div>
          <p className="text-xs text-gray-500 text-center mb-1">
            Tính năng phân tích đang phát triển
          </p>
          <p className="text-xs text-gray-400 text-center max-w-md">
            Sắp có phân tích chi tiết về hiệu suất, thời gian xử lý.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden overflow-y-auto" style={{ maxHeight: '85vh', width: '100%' }}>
      <div className="flex flex-col h-full">
        {/* Task Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium truncate max-w-[70%]">{task.companyId.name || 'N/A'}</h2>
            {getStatusBadge(task.status || 'Pending')}
          </div>
          <p className="text-xs text-blue-100 mt-0.5 flex items-center">
            <MapPin size={12} className="mr-1" />
            <span className="truncate">{task.companyId.address || 'Chưa có địa chỉ'}</span>
          </p>
          <div className="flex items-center mt-1.5">
            <div className="bg-blue-400 bg-opacity-30 rounded-md px-2 py-0.5 flex items-center text-xs text-white">
              <User size={10} className="mr-1" />
              Người tạo: {getCreatorName()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex items-center px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              <FileText size={14} className="mr-1" />
              Chi tiết
            </button>
            <button
              className={`flex items-center px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={14} className="mr-1" />
              Lịch sử
            </button>
            <button
              className={`flex items-center px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart size={14} className="mr-1" />
              Phân tích
            </button>
          </div>
        </div>

        {/* Tab content with scrollable area */}
        <div className="p-4 overflow-y-auto flex-grow">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default MoreDetailsModal;