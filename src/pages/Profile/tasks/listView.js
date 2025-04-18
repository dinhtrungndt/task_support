import React from 'react'
import { LinkIcon, Tag, Calendar } from 'lucide-react'
import { Building } from 'lucide-react'
import { formatDate } from '../../../utils/formatDate'
import { getStatusClass, getStatusIcon } from '../../../utils/StatusClass'

export const ListViewTask = ({ userTasks }) => {

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại kết nối
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doanh nghiệp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã dữ liệu
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại dữ liệu
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày lắp đặt
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {userTasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <LinkIcon size={14} className="text-gray-400 mr-1.5" />
                                    <span className="text-sm font-medium text-gray-800">{task.connectionType}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {task.companyId && typeof task.companyId === 'object' ? (
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                                            <Building size={12} />
                                        </div>
                                        <span className="text-sm text-gray-800">{task.companyId.name || 'N/A'}</span>
                                    </div>
                                ) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Tag size={14} className="text-gray-400 mr-1.5" />
                                    <span className="text-sm text-gray-700 font-mono">{task.codeData || 'N/A'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Tag size={14} className="text-gray-400 mr-1.5" />
                                    <span className="text-sm text-gray-700">{task.typeData || 'N/A'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Calendar size={14} className="text-gray-400 mr-1.5" />
                                    <span className="text-sm text-gray-700">{formatDate(task.installDate)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                                    {getStatusIcon(task.status)}
                                    {task.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
