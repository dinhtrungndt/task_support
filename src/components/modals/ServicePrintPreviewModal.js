import React, { useState, useRef } from 'react';
import { Printer, X, Settings, Check, FileText, Info, Server } from 'lucide-react';
import moment from 'moment';

const ServicePrintPreviewModal = ({ isOpen, onClose, services }) => {
  const printableRef = useRef(null);
  const [options, setOptions] = useState({
    showCompanyInfo: true,
    showServiceDetails: true,
    showDates: true,
    showUserInfo: true,
    showFeatures: true,
    title: 'Báo cáo danh sách dịch vụ',
    subtitle: `Ngày xuất: ${moment().format('DD/MM/YYYY')}`,
    orientation: 'portrait',
    showHeader: true,
    showFooter: true,
    pageSize: 'a4'
  });
  const [showSettings, setShowSettings] = useState(false);

  if (!isOpen) return null;

  const print = () => {
    const printContent = printableRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    const printStyles = `
      <style>
        @page {
          size: ${options.pageSize} ${options.orientation};
          margin: 1cm;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #333;
          line-height: 1.4;
          margin: 0;
          padding: 0;
        }
        .report-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          page-break-after: always;
        }
        .header {
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #10b981;
        }
        .header h1 {
          margin: 0 0 5px 0;
          color: #065f46;
          font-size: 18px;
          font-weight: 600;
        }
        .header p {
          margin: 3px 0;
          color: #6b7280;
          font-size: 12px;
        }
        .divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 10px 0;
          width: 100%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5px;
          font-size: 11px;
          table-layout: fixed;
        }
        th {
          background-color: #ecfdf5;
          color: #065f46;
          font-weight: 600;
          text-align: left;
          padding: 6px;
          border: 1px solid #d1fae5;
        }
        td {
          padding: 6px;
          text-align: left;
          border: 1px solid #e5e7eb;
          vertical-align: top;
          word-wrap: break-word;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .status-active {
          color: #059669;
          font-weight: 500;
          background-color: #d1fae5;
          border-radius: 4px;
          padding: 2px 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .status-pending {
          color: #d97706;
          font-weight: 500;
          background-color: #fef3c7;
          border-radius: 4px;
          padding: 2px 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .status-inactive {
          color: #dc2626;
          font-weight: 500;
          background-color: #fee2e2;
          border-radius: 4px;
          padding: 2px 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .footer {
          margin-top: 15px;
          text-align: right;
          font-size: 10px;
          color: #6b7280;
          padding-top: 5px;
          border-top: 1px solid #e5e7eb;
        }
        .price {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #065f46;
        }
        .features {
          font-size: 10px;
        }
        @media print {
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          button { display: none !important; }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          tr:nth-child(even) {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          th {
            background-color: #ecfdf5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          * {
            box-sizing: border-box;
          }
        }
      </style>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>*</title>');
    printWindow.document.write(printStyles);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Print after everything is loaded
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return "○";
    switch (status.toLowerCase()) {
      case "active":
        return "●";
      case "inactive":
        return "✕";
      case "pending":
        return "○";
      default:
        return "○";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const toggleOption = (option) => {
    setOptions({
      ...options,
      [option]: !options[option]
    });
  };

  const handleTitleChange = (e) => {
    setOptions({
      ...options,
      title: e.target.value
    });
  };

  const handleSubtitleChange = (e) => {
    setOptions({
      ...options,
      subtitle: e.target.value
    });
  };

  const setOrientation = (orientation) => {
    setOptions({
      ...options,
      orientation
    });
  };

  // Tính toán cấu trúc có bao nhiêu cột để quyết định độ rộng bảng
  const calculateColumnCount = () => {
    let count = 2; // STT và tên dịch vụ là cột cơ bản
    if (options.showCompanyInfo) count += 2;
    if (options.showServiceDetails) count += 4;
    if (options.showDates) count += 2;
    if (options.showUserInfo) count += 1;
    if (options.showFeatures) count += 1;
    return count;
  };

  const columnCount = calculateColumnCount();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-full max-h-[90vh] flex flex-col transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-amber-800 flex items-center">
            <Server size={20} className="mr-2 text-amber-600" />
            Xem trước báo cáo dịch vụ
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg hover:bg-amber-50 text-gray-700 transition-all duration-200 ease-in-out flex items-center text-sm font-medium border ${showSettings ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-gray-200'}`}
              title="Tùy chỉnh"
            >
              <Settings size={16} className={`mr-1 ${showSettings ? 'text-amber-600' : 'text-gray-600'}`} />
              Tùy chỉnh
            </button>
            <button
              onClick={print}
              className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200 ease-in-out flex items-center text-sm font-medium shadow-sm hover:shadow"
              title="In"
            >
              <Printer size={16} className="mr-1" />
              In báo cáo
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-500 transition-all duration-200 ease-in-out"
              title="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Settings Panel */}
          {showSettings && (
            <div className="w-72 border-r border-gray-200 p-5 bg-gray-50 overflow-y-auto animate-slideInLeft rounded-bl-xl">
              <h3 className="font-medium mb-4 text-gray-800 flex items-center">
                <Settings size={16} className="mr-2 text-amber-600" />
                Tùy chỉnh báo cáo
              </h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">
                    Tiêu đề báo cáo
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    value={options.title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">
                    Phụ đề
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    value={options.subtitle}
                    onChange={handleSubtitleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">
                    Hướng giấy
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-2 px-3 text-sm rounded-lg border flex items-center justify-center transition-all duration-200 ${
                        options.orientation === 'portrait'
                          ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm'
                          : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setOrientation('portrait')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                        <rect width="10" height="14" x="7" y="5" rx="1" strokeWidth="2" stroke="currentColor" fill="none"/>
                      </svg>
                      Dọc
                    </button>
                    <button
                      className={`flex-1 py-2 px-3 text-sm rounded-lg border flex items-center justify-center transition-all duration-200 ${
                        options.orientation === 'landscape'
                          ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm'
                          : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setOrientation('landscape')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                        <rect width="14" height="10" x="5" y="7" rx="1" strokeWidth="2" stroke="currentColor" fill="none"/>
                      </svg>
                      Ngang
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <label className="text-sm font-medium block mb-3 text-gray-700">
                    Hiển thị thông tin
                  </label>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showHeader}
                          onChange={() => toggleOption('showHeader')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showHeader && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Tiêu đề báo cáo
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showCompanyInfo}
                          onChange={() => toggleOption('showCompanyInfo')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showCompanyInfo && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Thông tin doanh nghiệp
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showServiceDetails}
                          onChange={() => toggleOption('showServiceDetails')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showServiceDetails && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Chi tiết dịch vụ
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showDates}
                          onChange={() => toggleOption('showDates')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showDates && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Ngày tháng
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showUserInfo}
                          onChange={() => toggleOption('showUserInfo')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showUserInfo && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Thông tin người tạo
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showFeatures}
                          onChange={() => toggleOption('showFeatures')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showFeatures && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Tính năng
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-amber-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showFooter}
                          onChange={() => toggleOption('showFooter')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200">
                          {options.showFooter && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Chân trang
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg mx-auto border border-gray-200 transition-all duration-300" ref={printableRef}>
              <div className="report-container">
                {options.showHeader && (
                  <div className="header">
                    <h1 className="text-xl font-bold text-amber-800">{options.title}</h1>
                    <p className="text-sm text-gray-600">{options.subtitle}</p>
                    {services.length > 0 && (
                      <p className="text-sm mt-2">Tổng số: <span className="font-semibold">{services.length}</span> dịch vụ</p>
                    )}
                  </div>
                )}

                {services.length > 0 ? (
                  <div className="overflow-auto">
                    <table className="w-full border-collapse text-sm" style={{ minWidth: columnCount > 8 ? '100%' : 'auto' }}>
                      <thead>
                        <tr>
                          <th className="border p-2 text-center" style={{ width: '40px' }}>STT</th>
                          <th className="border p-2" style={{ width: '130px' }}>Tên dịch vụ</th>
                          {options.showCompanyInfo && (
                            <>
                              <th className="border p-2" style={{ width: '100px' }}>MST</th>
                              <th className="border p-2" style={{ width: '130px' }}>Doanh nghiệp</th>
                            </>
                          )}
                          {options.showServiceDetails && (
                            <>
                              <th className="border p-2" style={{ width: '90px' }}>Loại dịch vụ</th>
                              <th className="border p-2" style={{ width: '90px' }}>Giá dịch vụ</th>
                              <th className="border p-2 text-center" style={{ width: '70px' }}>Thời hạn</th>
                              <th className="border p-2" style={{ width: '80px' }}>Trạng thái</th>
                            </>
                          )}
                          {options.showDates && (
                            <>
                              <th className="border p-2" style={{ width: '90px' }}>Ngày tạo</th>
                              <th className="border p-2" style={{ width: '90px' }}>Ngày cập nhật</th>
                            </>
                          )}
                          {options.showUserInfo && (
                            <th className="border p-2" style={{ width: '110px' }}>Người tạo</th>
                          )}
                          {options.showFeatures && (
                            <th className="border p-2" style={{ width: '130px' }}>Tính năng</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service, index) => (
                          <tr key={service._id || index} className="hover:bg-amber-50 transition-colors duration-150">
                            <td className="border p-2 text-center">{index + 1}</td>
                            <td className="border p-2 font-medium">{service.name || 'N/A'}</td>
                            {options.showCompanyInfo && (
                              <>
                                <td className="border p-2">{service.companyId?.mst || 'N/A'}</td>
                                <td className="border p-2">{service.companyId?.name || 'N/A'}</td>
                              </>
                            )}
                            {options.showServiceDetails && (
                              <>
                                <td className="border p-2">
                                  <span className="type-tag">{service.type || 'N/A'}</span>
                                </td>
                                <td className="border p-2 price">{formatCurrency(service.price)}</td>
                                <td className="border p-2 text-center">
                                  {service.duration ? `${service.duration} tháng` : 'N/A'}
                                </td>
                                <td className="border p-2">
                                  <span className={getStatusClass(service.status)}>
                                    {getStatusIcon(service.status)} {service.status || 'N/A'}
                                  </span>
                                </td>
                              </>
                            )}
                            {options.showDates && (
                              <>
                                <td className="border p-2">
                                  {service.createdAt ? moment(service.createdAt).format('DD/MM/YYYY') : 'N/A'}
                                </td>
                                <td className="border p-2">
                                  {service.lastModified ? moment(service.lastModified).format('DD/MM/YYYY') : 'N/A'}
                                </td>
                              </>
                            )}
                            {options.showUserInfo && (
                              <td className="border p-2">
                                {service.userCreated?.name || (typeof service.userCreated === 'string' ? service.userCreated : 'N/A')}
                              </td>
                            )}
                            {options.showFeatures && (
                              <td className="border p-2 features">
                                {service.features && service.features.length > 0 ?
                                  <div className="flex flex-wrap gap-1">
                                    {service.features.map((feature, idx) => (
                                      <span key={idx} className="inline-block bg-amber-50 text-amber-700 text-xs px-1.5 py-0.5 rounded border border-amber-100">
                                        {feature}
                                      </span>
                                    ))}
                                  </div> : 'N/A'}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <Server size={36} className="mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">Không có dữ liệu để hiển thị</p>
                    <p className="text-sm mt-1">Vui lòng chọn hoặc thêm dịch vụ để xem báo cáo</p>
                  </div>
                )}

                {options.showFooter && (
                  <div className="footer">
                    <p>Báo cáo được tạo từ hệ thống quản lý • {moment().format('HH:mm DD/MM/YYYY')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePrintPreviewModal;