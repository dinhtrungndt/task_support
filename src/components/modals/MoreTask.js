import React from 'react';

const MoreDetailsModal = ({ task }) => {
  if (!task) return <div>Không có dữ liệu</div>;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-md font-semibold text-blue-700 mb-2">Thông tin chi tiết</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="font-medium">MST:</div>
          <div>{task.mst}</div>
          
          <div className="font-medium">Tên công ty:</div>
          <div>{task.name}</div>
          
          <div className="font-medium">Địa chỉ:</div>
          <div>{task.address}</div>
          
          <div className="font-medium">Loại kết nối:</div>
          <div>{task.connectionType}</div>
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-md">
        <h3 className="text-md font-semibold text-green-700 mb-2">Thông tin lắp đặt</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="font-medium">Người lắp đặt:</div>
          <div>{task.PInstaller}</div>
          
          <div className="font-medium">Mã dữ liệu:</div>
          <div>{task.codeData}</div>
          
          <div className="font-medium">Loại dữ liệu:</div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${
                task.typeData === 'Type 1' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                {task.typeData}
            </span>
          </div>
          
          <div className="font-medium">Ngày lắp:</div>
          <div>{task.AtSetting}</div>
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-md">
        <h3 className="text-md font-semibold text-purple-700 mb-2">Trạng thái</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="font-medium">Trạng thái hiện tại:</div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${
              task.status === 'Done' ? 'bg-blue-500' : 
              task.status === 'Pending' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {task.status}
            </span>
          </div>
          
          <div className="font-medium">Người tạo:</div>
          <div>{task.userId?.name || 'N/A'}</div>
          
          <div className="font-medium">Lịch sử hoạt động:</div>
          <div>
            <a href="#" className="text-blue-600 hover:underline">Xem lịch sử</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreDetailsModal;