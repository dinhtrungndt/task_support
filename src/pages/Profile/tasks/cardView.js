import React from 'react'
import { LinkIcon, Tag, Calendar } from 'lucide-react'
import { Building, MapPin, User } from 'lucide-react'
import { getStatusClass, getStatusIcon } from '../../../utils/StatusClass'
import { formatDate, formatDateDetail } from '../../../utils/formatDate'

export const CardViewTask = ({userTasks}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
    {userTasks.map((task) => (
      <div key={task._id} className="border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Header with status */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <LinkIcon size={14} className="text-indigo-600 mr-1.5" />
            <span className="text-sm font-medium text-gray-800">{task.connectionType}</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
            {getStatusIcon(task.status)}
            {task.status}
          </span>
        </div>

        {/* Body content */}
        <div className="px-4 py-3">
          {/* Company info */}
          {task.companyId && typeof task.companyId === 'object' && (
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <Building size={14} className="text-gray-500 mr-1.5" />
                <span className="text-sm font-medium text-gray-800">{task.companyId.name || 'N/A'}</span>
              </div>
              {task.companyId.address && (
                <div className="flex items-center text-xs text-gray-500 pl-5">
                  <MapPin size={10} className="mr-1" />
                  <span className="truncate">{task.companyId.address}</span>
                </div>
              )}
            </div>
          )}

          {/* Data details */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Mã dữ liệu</p>
              <div className="flex items-center">
                <Tag size={12} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-800 font-medium font-mono">{task.codeData || 'N/A'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Loại dữ liệu</p>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                <span className="text-sm text-gray-800">{task.typeData || 'N/A'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Người lắp đặt</p>
              <div className="flex items-center">
                <User size={12} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-800">{task.installer || 'N/A'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Ngày lắp đặt</p>
              <div className="flex items-center">
                <Calendar size={12} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-800">{formatDateDetail(task.installDate)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
              <p className="text-sm text-gray-700">{task.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Được tạo {formatDate(task.createdAt)}</span>
            <span>Cập nhật {formatDate(task.updatedAt || task.lastModified)}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}
