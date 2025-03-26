import React, { useState } from 'react';

export const MoreDetailsModalBusiness = ({ business }) => {
  const [activeTab, setActiveTab] = useState('Tổng quan');

  if (!business) return null;

  const renderOverviewTab = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Thông tin công ty: <span className='text-red-400'>{business.name}</span></h3>
        <div className="space-y-2 text-xs">
          <p><strong>MST:</strong> {business.mst}</p>
          <p><strong>Địa chỉ:</strong> {business.address}</p>
          <p><strong>Người cài:</strong> {business.contactPerson}</p>
          <p><strong>Phone:</strong> {business.phone || 'N/A'}</p>
          <p><strong>Email:</strong> {business.email || 'N/A'}</p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Thông tin cài</h3>
        <div className="space-y-2 text-xs">
          <p>
            <strong>Tổng lần cài:</strong> {business.totalTasks}
            <span className="ml-2 text-green-600">
              ✓ Completed: {business.completedTasks}
            </span>
          </p>
          <p>
            <strong>Đang cài:</strong> {business.pendingTasks}
            <span className="ml-2 text-orange-600">
              ⏳ In Progress: {business.pendingTasks}
            </span>
          </p>
          <p>
            <strong>Hủy cài:</strong> {business.rejectedTasks}
            <span className="ml-2 text-red-600">
              ✗ Rejected: {business.rejectedTasks}
            </span>
          </p>
          <p><strong>Loại dữ liệu:</strong> {business.dataTypes.join(', ')}</p>
          <p><strong>Ngày sửa cuối:</strong> {new Date(business.lastModified).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  const renderInstallationHistoryTab = () => (
    <div className="overflow-y-auto max-h-96">
      <table className="w-full text-left text-xs">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="p-2">Ngày cài</th>
            <th className="p-2">Loại dữ liệu</th>
            <th className="p-2">Người cài</th>
            <th className="p-2">Loại kết nối</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Mã Data</th>
          </tr>
        </thead>
        <tbody>
          {business.installationHistory.map((record, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">{record.date}</td>
              <td className="p-2">{record.type}</td>
              <td className="p-2">{record.installer}</td>
              <td className="p-2">{record.connectionType}</td>
              <td className="p-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs
                  ${record.status === 'Done' ? 'bg-green-100 text-green-600' : 
                    record.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                    'bg-red-100 text-red-600'}
                `}>
                  {record.status}
                </span>
              </td>
              <td className="p-2">{record.notes || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProblemAnalysisTab = () => {
    const rejectedTasks = business.installationHistory.filter(
      record => record.status === 'Rejected'
    );

    const problemTypes = {};
    rejectedTasks.forEach(task => {
      if (task.notes) {
        const problemKey = task.notes.toLowerCase();
        problemTypes[problemKey] = (problemTypes[problemKey] || 0) + 1;
      }
    });

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Từ chối: </h3>
          <p className="text-xs">Tổng lần hủy: {rejectedTasks.length}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2">Lỗi thường gặp:</h4>
          <ul className="space-y-1">
            {Object.entries(problemTypes).length > 0 ? (
              Object.entries(problemTypes).map(([problem, count]) => (
                <li key={problem} className="text-xs">
                  • {problem}: {count} lỗi{count > 1 ? 's' : ''}
                </li>
              ))
            ) : (
              <li className="text-xs text-gray-500">Không có Lý do cụ thể nào được xác định</li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2">Khuyến nghị:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Xem lại quá trình cài đặt</li>
            <li>• Cung cấp đào tạo bổ sung cho người cài đặt</li>
            <li>• Kiểm tra thiết bị và loại kết nối</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-xs ${activeTab === 'Tổng quan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('Tổng quan')}
        >
          Tổng quan
        </button>
        <button
          className={`px-4 py-2 text-xs ${activeTab === 'Lịch sử' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('Lịch sử')}
        >
          Lịch sử
        </button>
        <button
          className={`px-4 py-2 text-xs ${activeTab === 'Lý do' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('Lý do')}
        >
          Lý do
        </button>
      </div>

      <div>
        {activeTab === 'Tổng quan' && renderOverviewTab()}
        {activeTab === 'Lịch sử' && renderInstallationHistoryTab()}
        {activeTab === 'Lý do' && renderProblemAnalysisTab()}
      </div>
    </div>
  );
};

export default MoreDetailsModalBusiness;