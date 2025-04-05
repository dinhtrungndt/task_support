// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Search, Briefcase, FileText, Package, Filter, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { HeaderPages } from '../../components/header';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  
  // Get data from Redux store
  const { tasks } = useSelector(state => state.tasks);
  const { businesses } = useSelector(state => state.business);
  const { services } = useSelector(state => state.services);
  
  // Search results
  const [taskResults, setTaskResults] = useState([]);
  const [businessResults, setBusinessResults] = useState([]);
  const [serviceResults, setServiceResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  
  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      navigate('/');
      return;
    }
    
    setIsSearching(true);
    
    // Search function
    const performSearch = () => {
      const searchTermLower = searchQuery.toLowerCase();
      
      // Search in tasks
      const filteredTasks = tasks.filter(task => 
        (task.companyName && task.companyName.toLowerCase().includes(searchTermLower)) ||
        (task.mst && task.mst.toLowerCase().includes(searchTermLower)) ||
        (task.address && task.address.toLowerCase().includes(searchTermLower)) ||
        (task.connectionType && task.connectionType.toLowerCase().includes(searchTermLower)) ||
        (task.installer && task.installer.toLowerCase().includes(searchTermLower)) ||
        (task.codeData && task.codeData.toLowerCase().includes(searchTermLower)) ||
        (task.typeData && task.typeData.toLowerCase().includes(searchTermLower)) ||
        (task.status && task.status.toLowerCase().includes(searchTermLower))
      );
      
      // Search in businesses
      const filteredBusinesses = businesses.filter(business => 
        (business.name && business.name.toLowerCase().includes(searchTermLower)) ||
        (business.mst && business.mst.toLowerCase().includes(searchTermLower)) ||
        (business.address && business.address.toLowerCase().includes(searchTermLower))
      );
      
      // Search in services
      const filteredServices = services.filter(service => 
        (service.name && service.name.toLowerCase().includes(searchTermLower)) ||
        (service.type && service.type.toLowerCase().includes(searchTermLower)) ||
        (service.description && service.description.toLowerCase().includes(searchTermLower)) ||
        (service.companyId?.name && service.companyId.name.toLowerCase().includes(searchTermLower))
      );
      
      setTaskResults(filteredTasks);
      setBusinessResults(filteredBusinesses);
      setServiceResults(filteredServices);
      setIsSearching(false);
    };
    
    performSearch();
  }, [searchQuery, tasks, businesses, services, navigate]);
  
  // Calculate total results
  const totalResults = taskResults.length + businessResults.length + serviceResults.length;
  
  // Tabs data
  const tabsData = [
    { id: 'all', label: 'Tất cả', count: totalResults },
    { id: 'tasks', label: 'Công việc', count: taskResults.length },
    { id: 'businesses', label: 'Doanh nghiệp', count: businessResults.length },
    { id: 'services', label: 'Dịch vụ', count: serviceResults.length },
  ];
  
  // Handle navigation
  const handleItemClick = (type, id) => {
    switch(type) {
      case 'task':
        navigate(`/task?id=${id}`);
        break;
      case 'business':
        navigate(`/business?id=${id}`);
        break;
      case 'service':
        navigate(`/service?id=${id}`);
        break;
      default:
        break;
    }
  };
  
  // Get status class for tasks
  const getStatusClassName = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderPages title="Kết quả tìm kiếm" />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Search header */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tìm kiếm mọi thứ..."
                value={searchQuery}
                onChange={(e) => navigate(`/search?q=${encodeURIComponent(e.target.value)}`)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => navigate('/search?q=')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {isSearching ? (
          <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium text-gray-700">Đang tìm kiếm...</h3>
          </div>
        ) : totalResults > 0 ? (
          <>
            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <TabsList className="grid grid-cols-4 gap-2">
                  {tabsData.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex justify-between items-center">
                      <span>{tab.label}</span>
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tab.count}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Search results */}
              <TabsContent value="all" className="space-y-4 mt-4">
                {/* Tasks section */}
                {taskResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText size={18} className="text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-800">Công việc</h3>
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{taskResults.length}</span>
                      </div>
                      {taskResults.length > 5 && (
                        <button 
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
                          onClick={() => setActiveTab('tasks')}
                        >
                          Xem tất cả <ChevronRight size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {(activeTab === 'all' ? taskResults.slice(0, 5) : taskResults).map(task => (
                        <div 
                          key={task._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick('task', task._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{task.companyName || 'Không có tên'}</h4>
                              <p className="text-sm text-gray-500 mt-1">MST: {task.mst || 'N/A'}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>Loại kết nối: {task.connectionType || 'N/A'}</span>
                                <span className="mx-2">•</span>
                                <span>Người lắp đặt: {task.installer || 'N/A'}</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClassName(task.status || 'Pending')}`}>
                              {task.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Businesses section */}
                {businessResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Briefcase size={18} className="text-emerald-600 mr-2" />
                        <h3 className="font-medium text-gray-800">Doanh nghiệp</h3>
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{businessResults.length}</span>
                      </div>
                      {businessResults.length > 5 && (
                        <button 
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
                          onClick={() => setActiveTab('businesses')}
                        >
                          Xem tất cả <ChevronRight size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {(activeTab === 'all' ? businessResults.slice(0, 5) : businessResults).map(business => (
                        <div 
                          key={business._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick('business', business._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{business.name || 'Không có tên'}</h4>
                              <p className="text-sm text-gray-500 mt-1">MST: {business.mst || 'N/A'}</p>
                              <p className="text-sm text-gray-500 mt-1">{business.address || 'N/A'}</p>
                            </div>
                            <div className="flex space-x-2">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {business.totalTasks || 0} công việc
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Services section */}
                {serviceResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Package size={18} className="text-purple-600 mr-2" />
                        <h3 className="font-medium text-gray-800">Dịch vụ</h3>
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{serviceResults.length}</span>
                      </div>
                      {serviceResults.length > 5 && (
                        <button 
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
                          onClick={() => setActiveTab('services')}
                        >
                          Xem tất cả <ChevronRight size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {(activeTab === 'all' ? serviceResults.slice(0, 5) : serviceResults).map(service => (
                        <div 
                          key={service._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick('service', service._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{service.name || 'Không có tên'}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Doanh nghiệp: {service.companyId?.name || 'N/A'}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>Giá: {service.price?.toLocaleString() || 0} VNĐ</span>
                                <span className="mx-2">•</span>
                                <span>Thời hạn: {service.duration || 0} tháng</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              service.type === 'Data' ? 'bg-blue-100 text-blue-800' :
                              service.type === 'Cloud' ? 'bg-purple-100 text-purple-800' :
                              service.type === 'Network' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {service.type || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Tasks tab */}
              <TabsContent value="tasks" className="space-y-4 mt-4">
                {taskResults.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText size={18} className="text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-800">Công việc</h3>
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{taskResults.length}</span>
                      </div>
                      <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Filter size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {taskResults.map(task => (
                        <div 
                          key={task._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick('task', task._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{task.companyName || 'Không có tên'}</h4>
                              <p className="text-sm text-gray-500 mt-1">MST: {task.mst || 'N/A'}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>Loại kết nối: {task.connectionType || 'N/A'}</span>
                                <span className="mx-2">•</span>
                                <span>Người lắp đặt: {task.installer || 'N/A'}</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClassName(task.status || 'Pending')}`}>
                              {task.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <AlertTriangle size={48} className="text-amber-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy công việc nào</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Không tìm thấy công việc nào phù hợp với từ khóa "{searchQuery}". 
                      Vui lòng thử từ khóa khác hoặc kiểm tra lại chính tả.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Businesses tab */}
              <TabsContent value="businesses" className="space-y-4 mt-4">
                {businessResults.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Briefcase size={18} className="text-emerald-600 mr-2" />
                        <h3 className="font-medium text-gray-800">Doanh nghiệp</h3>
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{businessResults.length}</span>
                      </div>
                      <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Filter size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {businessResults.map(business => (
                        <div 
                          key={business._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick('business', business._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{business.name || 'Không có tên'}</h4>
                              <p className="text-sm text-gray-500 mt-1">MST: {business.mst || 'N/A'}</p>
                              <p className="text-sm text-gray-500 mt-1">{business.address || 'N/A'}</p>
                            </div>
                            <div className="flex space-x-2">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {business.totalTasks || 0} công việc
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <AlertTriangle size={48} className="text-amber-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy doanh nghiệp nào</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Không tìm thấy doanh nghiệp nào phù hợp với từ khóa "{searchQuery}". 
                      Vui lòng thử từ khóa khác hoặc kiểm tra lại chính tả.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Services tab */}
              <TabsContent value="services" className="space-y-4 mt-4">
                {serviceResults.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Package size={18} className="text-purple-600 mr-2" />
                        <h3 className="font-medium text-gray-800">Dịch vụ</h3>
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{serviceResults.length}</span>
                      </div>
                      <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Filter size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {serviceResults.map(service => (
                        <div 
                          key={service._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick('service', service._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{service.name || 'Không có tên'}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Doanh nghiệp: {service.companyId?.name || 'N/A'}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>Giá: {service.price?.toLocaleString() || 0} VNĐ</span>
                                <span className="mx-2">•</span>
                                <span>Thời hạn: {service.duration || 0} tháng</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              service.type === 'Data' ? 'bg-blue-100 text-blue-800' :
                              service.type === 'Cloud' ? 'bg-purple-100 text-purple-800' :
                              service.type === 'Network' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {service.type || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <AlertTriangle size={48} className="text-amber-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy dịch vụ nào</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Không tìm thấy dịch vụ nào phù hợp với từ khóa "{searchQuery}". 
                      Vui lòng thử từ khóa khác hoặc kiểm tra lại chính tả.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
            <AlertTriangle size={48} className="text-amber-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-500 text-center max-w-md">
              Không tìm thấy kết quả nào phù hợp với từ khóa "{searchQuery}". 
              Vui lòng thử từ khóa khác hoặc kiểm tra lại chính tả.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;