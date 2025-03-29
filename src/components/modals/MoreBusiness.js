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

  // Safely check for typeData array
  const getTypeData = () => {
    if (!business.typeData) return [];
    if (Array.isArray(business.typeData)) return business.typeData;
    return [];
  };

  // Calculate completion percentage safely
  const getCompletionPercentage = () => {
    const total = business.totalTasks || 0;
    const completed = business.completedTasks || 0;
    
    if (total <= 0) return 0;
    return (completed / total) * 100;
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
              <p className="text-xs text-gray-500">Ngày tạo</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(business.createdAt)}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">Cập nhật cuối</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(business.lastModified)}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500">ID</p>
              <p className="text-sm font-medium text-gray-900">{business._id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
          <Calendar size={16} className="mr-1.5" />
          Thống kê công việc
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Tổng số</p>
            <p className="text-2xl font-semibold text-blue-600">{business.totalTasks || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Hoàn thành</p>
            <p className="text-2xl font-semibold text-green-600">{business.completedTasks || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Đang xử lý</p>
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
              {getTypeData().length > 0 ? 
                getTypeData().map((type, index) => (
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
            <p className="text-xs text-gray-500">Tỷ lệ hoàn thành</p>
            <p className="text-sm font-medium text-gray-900">
              {business.totalTasks > 0 
                ? `${getCompletionPercentage().toFixed(1)}%`
                : 'N/A'}
            </p>
            {business.totalTasks > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">Thống kê trạng thái công việc</h3>
        </div>
        <div className="p-4">
          {(business.totalTasks || 0) > 0 ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Hoàn thành ({business.completedTasks || 0})</span>
                  <span>
                    {business.totalTasks > 0 
                      ? `${((business.completedTasks || 0) / business.totalTasks * 100).toFixed(1)}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${business.totalTasks > 0 ? ((business.completedTasks || 0) / business.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Đang xử lý ({business.pendingTasks || 0})</span>
                  <span>
                    {business.totalTasks > 0 
                      ? `${((business.pendingTasks || 0) / business.totalTasks * 100).toFixed(1)}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${business.totalTasks > 0 ? ((business.pendingTasks || 0) / business.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Từ chối ({business.rejectedTasks || 0})</span>
                  <span>
                    {business.totalTasks > 0 
                      ? `${((business.rejectedTasks || 0) / business.totalTasks * 100).toFixed(1)}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${business.totalTasks > 0 ? ((business.rejectedTasks || 0) / business.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                <Calendar size={24} />
              </div>
              <p className="text-gray-500 text-sm">Chưa có dữ liệu về công việc</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">Phân loại dữ liệu</h3>
        </div>
        <div className="p-4">
          {getTypeData().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getTypeData().map((type, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                    {type.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                <Info size={24} />
              </div>
              <p className="text-gray-500 text-sm">Chưa có dữ liệu về loại dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRecommendationsTab = () => {
    const totalTasks = business.totalTasks || 0;
    const pendingTasks = business.pendingTasks || 0;
    const rejectedTasks = business.rejectedTasks || 0;
    const completedTasks = business.completedTasks || 0;
    const typeData = getTypeData();
    
    const hasRecommendations = 
      totalTasks === 0 || 
      pendingTasks > 0 || 
      rejectedTasks > 0 || 
      (totalTasks > 0 && completedTasks === 0) || 
      typeData.length === 0;
    
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h3 className="text-sm font-medium text-amber-800 mb-3 flex items-center">
            <AlertCircle size={16} className="mr-1.5" />
            Đề xuất hành động
          </h3>
          
          <ul className="space-y-2">
            {totalTasks === 0 && (
              <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
                <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Thêm công việc mới cho doanh nghiệp này</span>
              </li>
            )}
            
            {pendingTasks > 0 && (
              <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
                <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Có {pendingTasks} công việc đang xử lý cần cập nhật</span>
              </li>
            )}
            
            {rejectedTasks > 0 && (
              <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
                <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Kiểm tra lý do từ chối của {rejectedTasks} công việc</span>
              </li>
            )}
            
            {totalTasks > 0 && completedTasks === 0 && (
              <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
                <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Chưa có công việc nào được hoàn thành. Cần kiểm tra tiến độ</span>
              </li>
            )}
            
            {typeData.length === 0 && (
              <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
                <ChevronRight size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Cập nhật loại dữ liệu cho doanh nghiệp</span>
              </li>
            )}
            
            {/* Nếu không có đề xuất nào */}
            {!hasRecommendations && (
              <li className="flex items-start p-3 bg-white rounded-md border border-gray-100">
                <ChevronRight size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Mọi thứ đang hoạt động tốt. Không có vấn đề cần giải quyết</span>
              </li>
            )}
          </ul>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
            <Info size={16} className="mr-1.5" />
            Tóm tắt tình trạng
          </h3>
          
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-700">
              {totalTasks === 0 ? (
                "Doanh nghiệp chưa có công việc nào được tạo. Bạn cần tạo công việc để bắt đầu quản lý."
              ) : completedTasks === totalTasks ? (
                "Tất cả công việc đã hoàn thành. Doanh nghiệp đang hoạt động tốt."
              ) : pendingTasks > completedTasks ? (
                `Đa số công việc (${pendingTasks}/${totalTasks}) đang trong trạng thái xử lý. Cần theo dõi tiến độ.`
              ) : rejectedTasks > 0 ? (
                `Có ${rejectedTasks} công việc bị từ chối. Cần xem xét lý do và giải quyết vấn đề.`
              ) : (
                `Doanh nghiệp có ${totalTasks} công việc, trong đó ${completedTasks} đã hoàn thành (${getCompletionPercentage().toFixed(1)}%).`
              )}
            </p>
            
            {typeData.length > 0 && (
              <p className="text-sm text-gray-700 mt-2">
                Doanh nghiệp đang sử dụng các loại dữ liệu: {typeData.join(', ')}.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden" style={{ maxHeight: '85vh', width: '100%' }}>
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex overflow-x-auto">
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
                activeTab === 'Công việc' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('Công việc')}
            >
              <Calendar size={16} className="mr-1.5" />
              Công việc
            </button>
            <button
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'Đề xuất' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('Đề xuất')}
            >
              <AlertCircle size={16} className="mr-1.5" />
              Đề xuất
            </button>
          </div>
        </div>

        {/* Tab Content - make it scrollable */}
        <div className="p-4 overflow-y-auto flex-grow">
          {activeTab === 'Tổng quan' && renderOverviewTab()}
          {activeTab === 'Công việc' && renderTasksTab()}
          {activeTab === 'Đề xuất' && renderRecommendationsTab()}
        </div>
      </div>
    </div>
  );
};

export default MoreDetailsModalBusiness;