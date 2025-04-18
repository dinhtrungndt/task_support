import React from 'react'
import { getTypeBadge } from '../../../utils/TypeBadge'
import { formatCurrency } from '../../../utils/formatPrice'
import { getStatusClass, getStatusIcon } from '../../../utils/StatusClass'
import { Shield, Tag, DollarSign, Clock, Building } from 'lucide-react'


export const ListViewService = ({userServices}) => {
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên dịch vụ
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Loại dịch vụ
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Doanh nghiệp
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Giá dịch vụ
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thời hạn
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {userServices.map((service) => (
          <tr key={service._id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                  <Shield size={12} />
                </div>
                <span className="text-sm font-medium text-gray-800">{service.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadge(service.type)}`}>
                <Tag size={12} className="mr-1" />
                {service.type || "N/A"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {service.companyId && typeof service.companyId === 'object' ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-1.5">
                    <Building size={10} />
                  </div>
                  <span className="text-sm text-gray-800">{service.companyId.name || 'N/A'}</span>
                </div>
              ) : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <DollarSign size={14} className="text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-800">{formatCurrency(service.price)}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Clock size={14} className="text-gray-400 mr-1.5" />
                <span className="text-sm text-gray-700">{service.duration || 0} tháng</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(service.status)}`}>
                {getStatusIcon(service.status)}
                {service.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}
