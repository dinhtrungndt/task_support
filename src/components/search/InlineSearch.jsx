// src/components/search/InlineSearch.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, Briefcase, FileText, Package, Loader2 } from 'lucide-react';
import { useSearch } from '../../contexts/search/SearchContext';
import { useNavigate } from 'react-router-dom';

const InlineSearch = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    isSearching,
    handleSelectResult 
  } = useSearch();
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Handle clicking outside of search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Show results when typing or when input is focused
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsResultsVisible(true);
    }
  }, [searchTerm, searchResults]);
  
  // Handle key navigation in search results
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
      setIsResultsVisible(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsResultsVisible(false);
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
    <div ref={searchRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsResultsVisible(true);
          }}
        />
        
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Search results dropdown */}
      {isResultsVisible && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={20} className="animate-spin text-indigo-600 mr-2" />
              <p className="text-gray-600 text-sm">Đang tìm kiếm...</p>
            </div>
          ) : searchResults.length > 0 && searchTerm.trim() ? (
            <ul className="divide-y divide-gray-100">
              {searchResults.map((result, index) => (
                <li 
                  key={`${result.type}-${result.id}`}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                    index === focusedIndex ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => {
                    handleSelectResult(result);
                    setIsResultsVisible(false);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">{getResultIcon(result.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{result.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{result.subtitle}</p>
                    </div>
                    <div className="self-center ml-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {result.type === 'business' ? 'Doanh nghiệp' : 
                         result.type === 'task' ? 'Công việc' : 
                         result.type === 'service' ? 'Dịch vụ' : result.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm.trim() ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Không tìm thấy kết quả nào cho "{searchTerm}"</p>
            </div>
          ) : (
            <div className="py-4 px-4">
              <p className="text-gray-500 mb-3 text-sm font-medium">Tìm kiếm nhanh</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: 'Tìm doanh nghiệp', icon: <Briefcase size={14} className="text-emerald-600" /> },
                  { label: 'Tìm công việc', icon: <FileText size={14} className="text-blue-600" /> },
                  { label: 'Tìm bảo hành', icon: <Package size={14} className="text-purple-600" /> },
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
      )}
    </div>
  );
};

export default InlineSearch;