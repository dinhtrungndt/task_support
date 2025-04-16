import React, { useState, useRef } from 'react';
import { Printer, X, Settings, Check, FileText, Info } from 'lucide-react';
import moment from 'moment';

const TasksPrintPreviewModal = ({ isOpen, onClose, tasks }) => {
  const printableRef = useRef(null);
  const [options, setOptions] = useState({
    showCompanyInfo: true,
    showConnectionInfo: true,
    showDates: true,
    showUserInfo: true,
    showNotes: true,
    title: 'Báo cáo danh sách công việc',
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
          border-bottom: 1px solid #3b82f6;
        }
        .header h1 {
          margin: 0 0 5px 0;
          color: #1e40af;
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
          background-color: #eff6ff;
          color: #1e40af;
          font-weight: 600;
          text-align: left;
          padding: 6px;
          border: 1px solid #dbeafe;
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
        .status-done, .status-active {
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
        .status-rejected, .status-inactive {
          color: #dc2626;
          font-weight: 500;
          background-color: #fee2e2;
          border-radius: 4px;
          padding: 2px 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .type-tag {
          display: inline-block;
          padding: 1px 6px;
          background-color: #d1fae5;
          color: #059669;
          border-radius: 4px;
          font-size: 11px;
          border: 1px solid #a7f3d0;
          font-weight: normal;
        }
        .connection-type-tag {
          display: inline-block;
          padding: 1px 6px;
          background-color: #dbeafe;
          color: #2563eb;
          border-radius: 4px;
          font-size: 11px;
          border: 1px solid #bfdbfe;
          font-weight: normal;
        }
        .footer {
          margin-top: 15px;
          text-align: right;
          font-size: 10px;
          color: #6b7280;
          padding-top: 5px;
          border-top: 1px solid #e5e7eb;
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
            background-color: #eff6ff !important;
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
    switch (status) {
      case "Done":
        return "status-done";
      case "Pending":
        return "status-pending";
      case "Rejected":
        return "status-rejected";
      case "Active":
        return "status-active";
      case "Inactive":
        return "status-inactive";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return "●";
      case "Pending":
        return "○";
      case "Rejected":
        return "✕";
      default:
        return "○";
    }
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
    let count = 3; // STT, trạng thái và các cột cơ bản
    if (options.showCompanyInfo) count += 3;
    if (options.showConnectionInfo) count += 4;
    if (options.showDates) count += 2;
    if (options.showUserInfo) count += 1;
    if (options.showNotes) count += 1;
    return count;
  };

  const columnCount = calculateColumnCount();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-full max-h-[90vh] flex flex-col transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-emerald-800 flex items-center">
            <FileText size={20} className="mr-2 text-emerald-600" />
            Xem trước khi in
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg hover:bg-emerald-50 text-gray-700 transition-all duration-200 ease-in-out flex items-center text-sm font-medium border ${showSettings ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200'}`}
              title="Tùy chỉnh"
            >
              <Settings size={16} className={`mr-1 ${showSettings ? 'text-emerald-600' : 'text-gray-600'}`} />
              Tùy chỉnh
            </button>
            <button
              onClick={print}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 ease-in-out flex items-center text-sm font-medium shadow-sm hover:shadow"
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
                <Settings size={16} className="mr-2 text-emerald-600" />
                Tùy chỉnh báo cáo
              </h3>

                              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">
                    Tiêu đề báo cáo
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
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
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-sm'
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
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-sm'
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
                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showHeader}
                          onChange={() => toggleOption('showHeader')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                          {options.showHeader && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Tiêu đề báo cáo
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showCompanyInfo}
                          onChange={() => toggleOption('showCompanyInfo')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                          {options.showCompanyInfo && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Thông tin công ty
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showConnectionInfo}
                          onChange={() => toggleOption('showConnectionInfo')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                          {options.showConnectionInfo && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Thông tin kết nối
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showDates}
                          onChange={() => toggleOption('showDates')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                          {options.showDates && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Ngày tháng
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showUserInfo}
                          onChange={() => toggleOption('showUserInfo')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                          {options.showUserInfo && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Thông tin người tạo
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showNotes}
                          onChange={() => toggleOption('showNotes')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                          {options.showNotes && <Check size={12} className="text-white" />}
                        </span>
                      </span>
                      Ghi chú
                    </label>

                    <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-gray-900 group p-1 rounded hover:bg-emerald-50 transition-colors duration-200">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={options.showFooter}
                          onChange={() => toggleOption('showFooter')}
                          className="sr-only peer"
                        />
                        <span className="w-5 h-5 rounded border border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-200">
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
                    <h1 className="text-xl font-bold text-emerald-800">{options.title}</h1>
                    <p className="text-sm text-gray-600">{options.subtitle}</p>
                    {tasks.length > 0 && (
                      <p className="text-sm mt-2">Tổng số: <span className="font-semibold">{tasks.length}</span> công việc</p>
                    )}
                  </div>
                )}

                {tasks.length > 0 ? (
                  <div className="overflow-auto">
                    <table className="w-full border-collapse text-sm" style={{ minWidth: columnCount > 8 ? '100%' : 'auto' }}>
                      <thead>
                        <tr>
                          <th className="border p-2 text-center" style={{ width: '50px' }}>STT</th>
                          {options.showCompanyInfo && (
                            <>
                              <th className="border p-2" style={{ width: '100px' }}>MST</th>
                              <th className="border p-2" style={{ width: '180px' }}>Tên công ty</th>
                              <th className="border p-2" style={{ width: '200px' }}>Địa chỉ</th>
                            </>
                          )}
                          {options.showConnectionInfo && (
                            <>
                              <th className="border p-2" style={{ width: '120px' }}>Loại kết nối</th>
                              <th className="border p-2" style={{ width: '120px' }}>Người lắp đặt</th>
                              <th className="border p-2" style={{ width: '100px' }}>Mã dữ liệu</th>
                              <th className="border p-2" style={{ width: '120px' }}>Loại dữ liệu</th>
                            </>
                          )}
                          {options.showDates && (
                            <>
                              <th className="border p-2" style={{ width: '100px' }}>Ngày lắp</th>
                              <th className="border p-2" style={{ width: '100px' }}>Ngày cập nhật</th>
                            </>
                          )}
                          <th className="border p-2" style={{ width: '100px' }}>Trạng thái</th>
                          {options.showUserInfo && (
                            <th className="border p-2" style={{ width: '120px' }}>Người tạo</th>
                          )}
                          {options.showNotes && (
                            <th className="border p-2" style={{ width: '150px' }}>Ghi chú</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task, index) => (
                          <tr key={task._id || index} className="hover:bg-blue-50 transition-colors duration-150">
                            <td className="border p-2 text-center">{index + 1}</td>
                            {options.showCompanyInfo && (
                              <>
                                <td className="border p-2 font-medium">{task.companyId?.mst || 'N/A'}</td>
                                <td className="border p-2">{task.companyId?.name || 'N/A'}</td>
                                <td className="border p-2">{task.companyId?.address || 'N/A'}</td>
                              </>
                            )}
                            {options.showConnectionInfo && (
                              <>
                                <td className="border p-2">
                                  <span className="connection-type-tag">{task.connectionType || 'N/A'}</span>
                                </td>
                                <td className="border p-2">{task.installer || 'N/A'}</td>
                                <td className="border p-2 font-mono">{task.codeData || 'N/A'}</td>
                                <td className="border p-2">
                                  <span className="type-tag">{task.typeData || 'N/A'}</span>
                                </td>
                              </>
                            )}
                            {options.showDates && (
                              <>
                                <td className="border p-2">
                                  {task.installDate ? moment(task.installDate).format('DD/MM/YYYY') : 'N/A'}
                                </td>
                                <td className="border p-2">
                                  {task.lastModified ? moment(task.lastModified).format('DD/MM/YYYY') : 'N/A'}
                                </td>
                              </>
                            )}
                                                            <td className="border p-2">
                                  <span className={getStatusClass(task.status)}>
                                    {getStatusIcon(task.status)} {task.status || 'Pending'}
                                  </span>
                                </td>
                            {options.showUserInfo && (
                              <td className="border p-2">
                                {task.userAdd?.name || (typeof task.userAdd === 'string' ? task.userAdd : 'N/A')}
                              </td>
                            )}
                            {options.showNotes && (
                              <td className="border p-2">{task.notes || 'N/A'}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <Info size={36} className="mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">Không có dữ liệu để hiển thị</p>
                    <p className="text-sm mt-1">Vui lòng chọn hoặc thêm công việc để xem báo cáo</p>
                  </div>
                )}

                {options.showFooter && (
                  <div className="footer">
                    <p>Báo cáo được tạo từ hệ thống quản lý công việc • {moment().format('HH:mm DD/MM/YYYY')}</p>
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

export default TasksPrintPreviewModal;