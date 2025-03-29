import React, { useEffect, useState } from 'react';
import { CheckCircle, ChevronDown, MoreVertical, CheckSquare, Clock, AlertTriangle, FileText, Users, Calendar } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../../../stores/redux/actions/taskActions';

export const TodayTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector(state => state.tasks);
  const [todayTasks, setTodayTasks] = useState([]);
  
  useEffect(() => {
    // Nếu tasks chưa được tải, gọi API để lấy dữ liệu
    if (!tasks.length) {
      dispatch(fetchTasks());
    }
    
    // Lọc ra các công việc hôm nay
    // Bạn có thể điều chỉnh logic này theo nhu cầu (ví dụ: lọc theo ngày, trạng thái, v.v.)
    const latestTasks = [...tasks]
      .sort((a, b) => new Date(b.createdAt || b.installDate) - new Date(a.createdAt || a.installDate))
      .slice(0, 5);
    
    setTodayTasks(latestTasks);
  }, [tasks, dispatch]);

  const getStatusClassName = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <CheckCircle size={14} className="mr-1.5" />;
      case "Pending":
        return <Clock size={14} className="mr-1.5" />;
      case "Rejected":
        return <AlertTriangle size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  // Get project statistics
  const projectStats = {
    weeklyActivity: 80,
    totalTasksDone: tasks.filter(task => task.status === 'Done').length,
    projectsWorked: tasks.length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-6">
        {/* Today's Tasks Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Công việc hôm nay</h2>
          </div>
          
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map((task, index) => (
                  <div 
                    key={task._id || index} 
                    className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`rounded-full w-6 h-6 flex items-center justify-center mr-3 ${
                      task.status === "Done" ? "bg-blue-600" : 
                      task.status === "Pending" ? "bg-amber-500" : "bg-red-500"
                    } text-white flex-shrink-0`}>
                      <CheckSquare size={14} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate">{task.companyName || 'Công việc không có tên'}</p>
                      <p className="text-xs text-gray-500 truncate">{task.connectionType || 'Không có loại kết nối'}</p>
                    </div>
                    
                    <span className={`ml-3 px-2.5 py-1 rounded-full text-xs flex items-center ${getStatusClassName(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FileText size={24} />
                </div>
                <p className="text-gray-500 text-sm">Không có công việc nào cho hôm nay</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Project Summary Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Tổng quan dự án</h2>
            
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors">
                <FileText size={14} className="mr-1.5" />
                Dự án
                <ChevronDown size={14} className="ml-1.5" />
              </button>
              
              <button className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors">
                <Users size={14} className="mr-1.5" />
                Quản lý
                <ChevronDown size={14} className="ml-1.5" />
              </button>
              
              <button className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors">
                <CheckCircle size={14} className="mr-1.5" />
                Trạng thái
                <ChevronDown size={14} className="ml-1.5" />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : tasks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công ty</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người lắp đặt</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày lắp</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr key={task._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FileText size={16} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{task.companyName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 mr-2">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.installer || 'N/A')}&background=random`} alt={task.installer || 'N/A'} />
                          </div>
                          <span className="text-sm text-gray-600">{task.installer || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-1.5 text-gray-400" />
                          {task.installDate ? new Date(task.installDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClassName(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <FileText size={32} />
                </div>
                <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right column */}
      <div className="space-y-6">
        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Activity Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800">Hoạt động hàng tuần</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-800">{projectStats.weeklyActivity}%</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">+12%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${projectStats.weeklyActivity}%` }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">So sánh với tuần trước</p>
              </div>
              
              <div className="ml-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <CheckCircle size={32} />
              </div>
            </div>
          </div>
          
          {/* Total Tasks Done Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800">Công việc hoàn thành</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="flex-1">
                <span className="text-3xl font-bold text-gray-800">{projectStats.totalTasksDone}</span>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full ${i < 3 ? 'bg-green-500' : 'bg-gray-200'}`}
                    ></div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Trong tháng này</p>
              </div>
              
              <div className="ml-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Clock size={32} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Worked Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800">Dự án đã tham gia</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <span className="text-3xl font-bold text-gray-800">{projectStats.projectsWorked}</span>
              <div className="mt-2 flex items-center">
                <span className="text-green-600 text-sm font-medium">+{Math.min(5, projectStats.projectsWorked)} dự án</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500 text-sm">Tháng này</span>
              </div>
            </div>
            
            <div className="ml-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <FileText size={32} />
            </div>
          </div>
          
          {/* Project chart */}
          <div className="h-20 mt-2">
            <div className="flex h-full items-end space-x-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = 20 + Math.floor(Math.random() * 60);
                return (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className={`w-full rounded-t-sm ${i === 5 ? 'bg-blue-500' : 'bg-blue-200'}`} 
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {i+1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Tháng 1</span>
            <span>Tháng 12</span>
          </div>
        </div>
        
        {/* Team Members Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800">Thành viên nhóm</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem tất cả
            </button>
          </div>
          
          <div className="flex flex-wrap -m-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-1">
                <div className="group relative">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white hover:border-blue-500 transition-all">
                    <img 
                      src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=User+${index+1}`} 
                      alt={`User ${index+1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Người dùng {index+1}
                  </div>
                </div>
              </div>
            ))}
            <div className="p-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer text-blue-600 hover:bg-blue-200 transition-colors">
                <span className="text-lg font-medium">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};