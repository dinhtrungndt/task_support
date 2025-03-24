import React from 'react';
import { HeaderPages } from '../../../components/header';
import { TaskData } from '../../../stores/data/task.task';

export const TodayTasks = () => {
  const todayTasks = [
    { id: 1, title: "Create a user flow of social application design", status: "Done" },
    { id: 2, title: "Create a user flow of social application design", status: "Pending" },
    { id: 3, title: "Landing page design for Fintech project of singapore", status: "Pending" },
    { id: 4, title: "Interactive prototype for app screens of deltamine project", status: "Rejected" },
    { id: 5, title: "Interactive prototype for app screens of deltamine project", status: "Done" },
  ];

  const getStatusClassName = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-600 px-4";
      case "Pending":
        return "bg-orange-100 text-orange-600 px-2";
      case "Rejected":
        return "bg-pink-100 text-pink-600 px-2";
      default:
        return "bg-gray-100 text-gray-600 px-2";
    }
  };

  return (
    <div className="space-y-4">
      {/* 2 column layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* right */}
        <div className="bg-white rounded-md shadow-sm p-3 pb-2 border-b-4 border-t-4 border-blue-500">
          {/* Today's Tasks Section */}
          <div className="bg-white rounded-md shadow-sm p-3 pt-0">
            <p className="text-base font-bold pt-1 mb-2">Today's Task</p>
            <div className="space-y-2">
              {todayTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className={`rounded-full w-5 h-5 flex items-center justify-center ${task.status === "Done" ? "bg-blue-600" : "bg-blue-600"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="flex-1 text-sm">{task.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClassName(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Project summary filters */}
          <div className="flex gap-2 mt-8">
            <button className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
              Project
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
              Project manager
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
              Status
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {/* Project summary table */}
          <div className="overflow-x-auto h-48 mt-4">
          <table className="min-w-full w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project manager</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due date</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {TaskData.map((project, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{project.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{project.projectManager}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{project.dueDate}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClassName(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        {/* right */}
        <div className="bg-white rounded-md shadow-sm p-3">
          {/* Weekly Activity and Total Tasks Section */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white rounded-md shadow-sm p-3 w-1/2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">Weekly Activity</p>
                <button className="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center mr-6">
                  <h2 className="text-3xl font-bold text-gray-800">80%</h2>
                </div>
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M5 10l2 2 8-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 10c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-3 w-1/2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">Total tasks <span className='text-green-600'>Done</span></p>
                <button className="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center mr-6">
                  <h2 className="text-3xl font-bold text-gray-800">40</h2>
                </div>
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Project Worked Section */}
          <div className="bg-white rounded-md shadow-sm p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold">Project Worked</p>
              <button className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center mr-6">
                <h2 className="text-3xl font-bold text-gray-800">105</h2>
              </div>
              <div className="w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          {/* Action */}
          <div className="bg-white rounded-md shadow-sm p-3">
            <p className="text-sm font-semibold">Action</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="user" className="w-8 h-8 rounded-full" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="user" className="w-8 h-8 rounded-full" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="user" className="w-8 h-8 rounded-full" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="user" className="w-8 h-8 rounded-full" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="user" className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};