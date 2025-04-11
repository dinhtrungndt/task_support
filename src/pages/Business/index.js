import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeaderPages } from "../../components/header";
import {
  Search,
  Plus,
  Trash2,
  Filter,
  MoreVertical,
  Download,
  ChevronUp,
} from "lucide-react";
import Modal from "../../components/modals";
import DropdownMenu from "../../components/DropdownMenu";
import EditBusinessModal from "../../components/modals/EditBusiness";
import MoreDetailsModalBusiness from "../../components/modals/MoreBusiness";
import CreateBusiness from "../../components/modals/CreateBusiness";
import {
  fetchBusinesses,
  deleteBusinesses,
  updateBusiness,
} from "../../stores/redux/actions/businessActions";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import BusinessList from "../../components/Business/Business";

export const BusinessPages = () => {
  const dispatch = useDispatch();
  const { businesses, loading, error } = useSelector((state) => state.business);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [openModalCreateBusiness, setOpenModalCreateBusiness] = useState(false);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update filtered businesses when the original list or search term changes
  useEffect(() => {
    setFilteredBusinesses(
      businesses.filter(
        (business) =>
          business.mst?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.typeData?.some((type) =>
            type.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
  }, [businesses, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Open edit business modal
  const handleEditBusiness = (business) => {
    setSelectedBusiness(business);
    setEditModalOpen(true);
    setActiveDropdown(null);
  };

  // Save business changes
  const handleSaveBusiness = async (updatedBusiness) => {
    try {
      if (!updatedBusiness._id) {
        console.error(
          "Business missing ID in handleSaveBusiness:",
          updatedBusiness
        );
        toast.error("Lỗi: Không thể cập nhật doanh nghiệp không có ID");
        return;
      }

      await dispatch(updateBusiness(updatedBusiness));

      setFilteredBusinesses((prevBusinesses) =>
        prevBusinesses.map((b) =>
          b._id === updatedBusiness._id ? { ...b, ...updatedBusiness } : b
        )
      );

      setEditModalOpen(false);
      toast.success("Cập nhật doanh nghiệp thành công");
    } catch (error) {
      console.error("Error in handleSaveBusiness:", error);
      toast.error(
        "Lỗi khi cập nhật doanh nghiệp: " + (error.message || "Đã xảy ra lỗi")
      );
    }
  };

  // Open more details modal
  const handleMoreOptions = (business) => {
    setSelectedBusiness(business);
    setMoreModalOpen(true);
    setActiveDropdown(null);
  };

  // Handle select all businesses
  const handleSelectAllChange = () => {
    if (selectedBusinessIds.length === filteredBusinesses.length) {
      setSelectedBusinessIds([]); // Unselect all
    } else {
      setSelectedBusinessIds(
        filteredBusinesses.map((business) => business._id)
      );
    }
  };

  // Handle individual business selection
  const handleCheckboxChange = (businessId) => {
    setSelectedBusinessIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(businessId)) {
        return prevSelectedIds.filter((id) => id !== businessId);
      } else {
        return [...prevSelectedIds, businessId];
      }
    });
  };

  // Delete selected businesses
  const handleDeleteSelected = async () => {
    if (selectedBusinessIds.length === 0) return;

    const confirmMessage =
      selectedBusinessIds.length === 1
        ? "Bạn có chắc chắn muốn xóa doanh nghiệp này?"
        : `Bạn có chắc chắn muốn xóa ${selectedBusinessIds.length} doanh nghiệp?`;

    const confirmation = window.confirm(confirmMessage);

    if (confirmation) {
      try {
        setIsDeleting(true);

        await dispatch(deleteBusinesses(selectedBusinessIds));

        setFilteredBusinesses((prevBusinesses) =>
          prevBusinesses.filter(
            (business) => !selectedBusinessIds.includes(business._id)
          )
        );

        setSelectedBusinessIds([]);
        toast.success("Xóa doanh nghiệp thành công");
      } catch (error) {
        toast.error(
          "Lỗi khi xóa doanh nghiệp: " + (error.message || "Đã xảy ra lỗi")
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle business created callback
  const handleBusinessCreated = (newBusiness) => {
    setFilteredBusinesses([...businesses, newBusiness]);
    setOpenModalCreateBusiness(false);
    toast.success("Tạo doanh nghiệp thành công");
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Export to Excel
  const handleExportToExcel = () => {
    let dataToExport = filteredBusinesses;

    if (selectedBusinessIds.length > 0) {
      dataToExport = filteredBusinesses.filter((business) =>
        selectedBusinessIds.includes(business._id)
      );
    }

    const exportData = dataToExport.map((business) => ({
      MST: business.mst || "",
      "Tên công ty": business.name || "",
      "Địa chỉ": business.address || "",
      "Tổng công việc": business.totalTasks || 0,
      "Hoàn thành": business.completedTasks || 0,
      "Đang làm": business.pendingTasks || 0,
      "Từ chối": business.rejectedTasks || 0,
      "Loại dữ liệu": business.typeData ? business.typeData.join(", ") : "",
      "Ngày cập nhật": business.lastModified
        ? new Date(business.lastModified).toLocaleDateString()
        : "",
      "Ngày tạo": business.createdAt
        ? new Date(business.createdAt).toLocaleDateString()
        : "",
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh nghiệp");

    const date = new Date();
    const fileName = `danh_sach_doanh_nghiep_${date.getDate()}_${
      date.getMonth() + 1
    }_${date.getFullYear()}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    toast.success(`Đã xuất ${exportData.length} doanh nghiệp ra file Excel`);
  };

  // Show error toast when error exists
  useEffect(() => {
    if (error) {
      toast.error("Lỗi khi tải dữ liệu: " + error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderPages title="Quản lý doanh nghiệp" />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-full">
        {/* Top Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm theo MST, tên công ty, địa chỉ..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={() => setOpenModalCreateBusiness(true)}
              >
                <Plus size={16} className="mr-1.5" />
                Thêm doanh nghiệp
              </button>

              {selectedBusinessIds.length > 0 && (
                <button
                  className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-1.5" />
                      Xóa ({selectedBusinessIds.length})
                    </>
                  )}
                </button>
              )}
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleExportToExcel}
              >
                <Download size={16} className="mr-1.5" />
                Xuất
                {selectedBusinessIds.length > 0
                  ? ` (${selectedBusinessIds.length})`
                  : ""}
              </button>
            </div>
          </div>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            {filteredBusinesses.length > 0 ? (
              <span className="font-medium">
                Tổng{" "}
                <span className="text-blue-600 font-semibold">
                  {filteredBusinesses.length}
                </span>{" "}
                doanh nghiệp
              </span>
            ) : (
              "Không tìm thấy doanh nghiệp nào"
            )}
          </p>
        </div>

        {/* Business List */}
        <BusinessList
          filteredBusinesses={filteredBusinesses}
          loading={loading}
          searchTerm={searchTerm}
          activeDropdown={activeDropdown}
          selectedBusinessIds={selectedBusinessIds}
          toggleDropdown={toggleDropdown}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAllChange={handleSelectAllChange}
          handleEditBusiness={handleEditBusiness}
          handleMoreOptions={handleMoreOptions}
          setSearchTerm={setSearchTerm}
          setActiveDropdown={setActiveDropdown}
        />

        {/* Create Business Modal */}
        {openModalCreateBusiness && (
          <CreateBusiness
            closeModal={() => setOpenModalCreateBusiness(false)}
            businesses={businesses}
            onBusinessCreated={handleBusinessCreated}
          />
        )}

        {/* Edit Business Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Chỉnh sửa thông tin doanh nghiệp"
        >
          <EditBusinessModal
            business={selectedBusiness}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveBusiness}
          />
        </Modal>

        {/* More Details Modal */}
        <Modal
          isOpen={moreModalOpen}
          onClose={() => setMoreModalOpen(false)}
          title="Thông tin chi tiết"
        >
          <MoreDetailsModalBusiness business={selectedBusiness} />
        </Modal>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all z-50"
            aria-label="Lên đầu trang"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
