import React from 'react';
import { HeaderPages } from '../../components/header';
import { Search, MoreVertical } from 'lucide-react';

const tasks = Array.from({ length: 100 }, (_, i) => ({
  name: `Task ${i + 1}`,
  created: 'Jan 4, 2024',
  due: 'Jan 6, 2024',
  last: 'Jan 6, 2024',
}));

export const TaskPages = () => {
  return (
    <div>
      {/* Header */}
      <HeaderPages title="Tasks" />
      <div className="container mx-auto p-4">
        {/* Search and Filter Buttons */}
        <div className="flex justify-between mt-4">
          <div className="flex w-1/3 border border-gray-400 rounded-lg p-2 text-xs">
            <input type="text" placeholder="Search Task" className="w-full bg-transparent focus:outline-none" />
            <Search className="mr-2 ml-2" color='#9ca3af' size={18} />
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-3 rounded-full text-xs hover:bg-blue-600">Approved</button>
            <button className="bg-green-500 text-white px-3 rounded-full text-xs hover:bg-green-600">Pending</button>
            <button className="bg-red-500 text-white px-3 rounded-full text-xs hover:bg-red-600">Rejected</button>
          </div>
        </div>
        {/* Task List */}
        <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0">
                <tr>
                  <th className="p-3 w-10">
                    <input type="checkbox" />
                  </th>
                  <th className="p-3">Task Name</th>
                  <th className="p-3">Task Created</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Last Activity</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3 flex items-center space-x-2">
                      <span className="bg-purple-100 text-purple-600 p-2 rounded-full">📁</span>
                      {task.name}
                    </td>
                    <td className="p-3">{task.created}</td>
                    <td className="p-3">{task.due}</td>
                    <td className="p-3">{task.last}</td>
                    <td className="p-3 text-right">
                      <MoreVertical className="cursor-pointer" size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Submit for Approvel */}
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Submit for Approval</button>
        </div>
      </div>
    </div>
  );
};