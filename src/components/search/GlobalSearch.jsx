// src/components/search/GlobalSearch.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, Briefcase, FileText, Package, Loader2, ChevronRight } from 'lucide-react';
import { useSearch } from '../../contexts/search/SearchContext';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    isSearching, 
    isSearchOpen,
    toggleSearch,
    handleSelectResult 
  } = useSearch();
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  // Handle clicking outside of search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (isSearchOpen) toggleSearch();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, toggleSearch]);
  
  // Focus input when search is opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Handle key navigation in search results
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(searchResults[focusedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleSearch();
    }
  };
  
  // Get icon based on result type
  const getResultIcon = (type) => {
    switch (type) {
      case 'task':
        return <FileText size={16} className="text-blue-600" />;
      case 'business':
        return <Briefcase size={16} className="text-emerald-600" />;
      case 'service':
        return <Package size={16} className="text-purple-600" />;
      default:
        return <ArrowRight size={16} className="text-gray-600" />;
    }
  };
  
  return (
    <>
      {/* Mobile button */}
      <button 
        className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200"
        onClick={toggleSearch}
      >
        <Search size={20} />
      </button>
      
      {/* Desktop search */}
      <div className="relative hidden md:block">
        <button
          onClick={toggleSearch} 
          className="flex items-center w-64 pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left text-gray-500"
        >
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <span>Tìm kiếm... (Ctrl + K)</span>
        </button>
      </div>
      
      {/* Search modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div 
            ref={searchRef}
            className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Search header */}
            <div className="relative flex items-center border-b border-gray-200">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              
              <input
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm mọi thứ..."
                className="w-full pl-12 pr-10 py-3 text-gray-800 focus:outline-none text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              
              {searchTerm && (
                <button 
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={18} />
                </button>
              )}
              
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={toggleSearch}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Search results */}
            <div className="max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={24} className="animate-spin text-indigo-600 mr-2" />
                  <p className="text-gray-600">Đang tìm kiếm...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {searchResults.map((result, index) => (
                    <li 
                      key={`${result.type}-${result.id}`}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        index === focusedIndex ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => handleSelectResult(result)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">{getResultIcon(result.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{result.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{result.subtitle}</p>
                        </div>
                        <div className="self-center ml-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                            {result.type === 'business' ? 'Doanh nghiệp' : 
                             result.type === 'task' ? 'Công việc' : 
                             result.type === 'service' ? 'Dịch vụ' : result.type}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : searchTerm ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không tìm thấy kết quả nào cho "{searchTerm}"</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-4 border-t border-gray-100">
                  <button 
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                      toggleSearch();
                    }}
                  >
                    Xem tất cả kết quả <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              ) : (
                <div className="py-6 px-4">
                  <p className="text-gray-500 mb-4">Tìm kiếm nhanh</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { label: 'Tìm doanh nghiệp', icon: <Briefcase size={14} /> },
                      { label: 'Tìm công việc', icon: <FileText size={14} /> },
                      { label: 'Tìm dịch vụ', icon: <Package size={14} /> },
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSearchTerm(item.label.split(' ')[1])}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Search footer */}
            <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500">
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 mr-1 bg-gray-200 rounded text-gray-700">↑</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 mr-1 bg-gray-200 rounded text-gray-700">↓</span>
                    để di chuyển
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center px-1.5 h-5 mr-1 bg-gray-200 rounded text-gray-700">Enter</span>
                    để chọn
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center px-1.5 h-5 mr-1 bg-gray-200 rounded text-gray-700">Esc</span>
                  để đóng
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;