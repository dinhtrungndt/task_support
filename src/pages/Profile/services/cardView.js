import React from 'react'
import { Tag, Shield, DollarSign, Clock, Building } from 'lucide-react'
import { getStatusClass, getStatusIcon } from '../../../utils/StatusClass'
import { getTypeBadge } from '../../../utils/TypeBadge'
import { formatCurrency } from '../../../utils/formatPrice'
import { formatDate } from '../../../utils/formatDate'

export const CardViewService = ({userServices}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                  {userServices.map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Header with status */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                            <Shield size={12} />
                          </div>
                          <span className="font-medium text-gray-800">{service.name}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(service.status)}`}>
                          {getStatusIcon(service.status)}
                          {service.status}
                        </span>
                      </div>

                      {/* Service type and company */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-gray-50">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadge(service.type)}`}>
                          <Tag size={12} className="mr-1" />
                          {service.type || "N/A"}
                        </span>

                        {service.companyId && typeof service.companyId === 'object' && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-1">
                              <Building size={10} />
                            </div>
                            <span className="text-xs text-gray-700">{service.companyId.name || 'N/A'}</span>
                          </div>
                        )}
                      </div>

                      {/* Body content */}
                      <div className="px-4 py-3">
                        {/* Description */}
                        {service.description && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                            <p className="text-sm text-gray-700">{service.description}</p>
                          </div>
                        )}

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Tính năng</p>
                            <div className="flex flex-wrap gap-1.5">
                              {service.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center"
                                >
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1"></div>
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price and duration */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Giá dịch vụ</p>
                            <div className="flex items-center">
                              <DollarSign size={14} className="text-indigo-500 mr-1" />
                              <span className="text-sm font-medium text-gray-800">{formatCurrency(service.price)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Thời hạn</p>
                            <div className="flex items-center">
                              <Clock size={14} className="text-indigo-500 mr-1" />
                              <span className="text-sm font-medium text-gray-800">{service.duration || 0} tháng</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        <div className="flex justify-between items-center">
                          <span>Được tạo {formatDate(service.createdAt)}</span>
                          <span>Cập nhật {formatDate(service.lastModified || service.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  )
}
