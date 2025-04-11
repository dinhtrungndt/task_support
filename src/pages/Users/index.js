import React, { useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../stores/redux/actions/userActions';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';

export const UserPages = () => {
  const dispatch = useDispatch();
  const {users, loading} = useSelector((state) => state.users);
  const {businesses} = useSelector((state) => state.business);
  console.log("business", businesses);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBusinesses());
  }, []);

  return (
    <>
      <div className="flex bg-gradient-to-br from-indigo-50 to-blue-50">
        {/* Main Content */}
        <div className="flex-1  p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-900">Thành viên</h1>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md text-sm font-medium flex items-center transition-all duration-200 transform hover:scale-105">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Thêm thành viên
              </button>
            </div>
            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 overflow-auto max-h-[calc(100vh-200px)]">
              {users.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 border border-gray-100 ">
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="relative">
                        <img
                          src={member.avatar ||`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
                          member.name
                        )}&size=32`}
                          alt={member.name}
                          className="w-16 h-16 rounded-full mr-4 ring-2 ring-opacity-10 ring-indigo-600"
                        />
                        <div className={`absolute bottom-0 right-4 w-4 h-4 rounded-full border-2 border-white
                        ${member.status === 'Online' ? 'bg-emerald-500' :
                            member.status === 'Away' ? 'bg-amber-400' : 'bg-gray-400'}`}>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-sm text-indigo-600 font-medium mb-2">{member.email}</p>
                        <div className="flex mt-3 space-x-4">
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            Nhắn tin
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Projects */}
            <h2 className="text-2xl font-bold text-indigo-900 mb-5 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Hoạt động của dự án
            </h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MST</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên doanh nghiệp</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tình trạng</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhập</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-900">{project.mst}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-900">{project.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div
                            className={`h-2.5 rounded-full ${project.totalTasks >= 10 ? 'bg-emerald-500' :
                              project.totalTasks >= 9 ? 'bg-blue-600' : 'bg-amber-500'
                              }`}
                            style={{ width: `${project.totalTasks}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{project.totalTasks}% complete</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(project.updatedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors duration-150">View</a>
                          <a href="#" className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md transition-colors duration-150">Edit</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Team Activity Feed */}
            <h2 className="text-2xl font-bold text-indigo-900 mb-5 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              Hoạt động gần đây
            </h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM"
                      alt="Mark Magnum"
                      className="w-10 h-10 rounded-full ring-2 ring-indigo-100"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-indigo-800">Mark Magnum</span> completed the task
                      <span className="font-medium text-gray-900"> "Create wireframes for mobile app"</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src="https://ui-avatars.com/api/?background=fecaca&color=991b1b&bold=true&name=EK"
                      alt="Emily Korgaard"
                      className="w-10 h-10 rounded-full ring-2 ring-red-100"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-red-800">Emily Korgaard</span> commented on
                      <span className="font-medium text-gray-900"> "Dashboard Redesign"</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      5 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src="https://ui-avatars.com/api/?background=d1fae5&color=065f46&bold=true&name=NL"
                      alt="Nadia Lauren"
                      className="w-10 h-10 rounded-full ring-2 ring-green-100"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-green-800">Nadia Lauren</span> uploaded
                      <span className="font-medium text-gray-900"> API documentation</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Yesterday at 1:34 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-150">
                  View all activity
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};