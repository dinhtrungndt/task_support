import React, { useState, useEffect } from 'react';
import { Search, Building, MapPin, CheckCircle, Info } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';

const BusinessSelector = ({ 
  selectedBusiness, 
  onBusinessSelect, 
  onClearSelection,
  className = ""
}) => {
  const dispatch = useDispatch();
  const { businesses, loading } = useSelector(state => state.business);
  
  const [businessSearch, setBusinessSearch] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);

  // Fetch businesses if needed
  useEffect(() => {
    if (!businesses.length) {
      dispatch(fetchBusinesses());
    }
  }, [dispatch, businesses.length]);

  // Filter businesses based on search term
  useEffect(() => {
    if (businessSearch.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const searchTerm = businessSearch.toLowerCase().trim();
      const filtered = businesses.filter(business =>
        (business.name && business.name.toLowerCase().includes(searchTerm)) ||
        (business.mst && business.mst.toLowerCase().includes(searchTerm))
      );
      setFilteredBusinesses(filtered);
    }
  }, [businessSearch, businesses]);

  // Clear search when a business is selected
  const handleBusinessSelect = (business) => {
    onBusinessSelect(business);
    setBusinessSearch('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm doanh nghiệp</label>
        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Search className="ml-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc MST" 
              className="w-full p-2.5 border-none focus:outline-none text-sm"
              value={businessSearch}
              onChange={(e) => setBusinessSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {selectedBusiness && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-800">Doanh nghiệp đã chọn</h3>
            <button 
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={onClearSelection}
            >
              Hủy chọn
            </button>
          </div>
          <div className="bg-white border border-gray-100 rounded-md p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{selectedBusiness.name}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Building size={14} className="mr-1" />
                  <span>MST: {selectedBusiness.mst}</span>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                <CheckCircle size={14} className="mr-1" />
                Đã chọn
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-start">
              <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>{selectedBusiness.address || 'Chưa có địa chỉ'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white">
        {loading ? (
          <div className="py-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredBusinesses.map((business) => (
              <div 
                key={business._id} 
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBusiness?._id === business._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleBusinessSelect(business)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{business.name}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Building size={14} className="mr-1" />
                      <span>MST: {business.mst}</span>
                    </div>
                  </div>
                  {selectedBusiness?._id === business._id && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      Đã chọn
                    </div>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500 flex items-start">
                  <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                  <span>{business.address || 'Chưa có địa chỉ'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <Info size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Không tìm thấy doanh nghiệp</p>
            <p className="text-xs text-gray-400 mt-1">Vui lòng thử tìm kiếm khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessSelector;