import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const navigate = useNavigate();
  
  // Get data from Redux store
  const { tasks } = useSelector(state => state.tasks);
  const { businesses } = useSelector(state => state.business);
  const { services } = useSelector(state => state.services);
  
  // Perform search when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Debounce search
    const debounceTimer = setTimeout(() => {
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search in tasks
      const taskResults = tasks
        .filter(task => 
          (task.companyName && task.companyName.toLowerCase().includes(searchTermLower)) ||
          (task.mst && task.mst.toLowerCase().includes(searchTermLower)) ||
          (task.address && task.address.toLowerCase().includes(searchTermLower)) ||
          (task.connectionType && task.connectionType.toLowerCase().includes(searchTermLower)) ||
          (task.installer && task.installer.toLowerCase().includes(searchTermLower)) ||
          (task.codeData && task.codeData.toLowerCase().includes(searchTermLower)) ||
          (task.typeData && task.typeData.toLowerCase().includes(searchTermLower)) ||
          (task.status && task.status.toLowerCase().includes(searchTermLower))
        )
        .slice(0, 5)
        .map(task => ({
          id: task._id,
          type: 'task',
          title: task.companyName || 'Không có tên',
          subtitle: `MST: ${task.mst || 'N/A'} - ${task.status || 'Pending'}`,
          route: '/task'
        }));
      
      // Search in businesses
      const businessResults = businesses
        .filter(business => 
          (business.name && business.name.toLowerCase().includes(searchTermLower)) ||
          (business.mst && business.mst.toLowerCase().includes(searchTermLower)) ||
          (business.address && business.address.toLowerCase().includes(searchTermLower))
        )
        .slice(0, 5)
        .map(business => ({
          id: business._id,
          type: 'business',
          title: business.name || 'Không có tên',
          subtitle: `MST: ${business.mst || 'N/A'}`,
          route: '/business'
        }));
      
      // Search in services
      const serviceResults = services
        .filter(service => 
          (service.name && service.name.toLowerCase().includes(searchTermLower)) ||
          (service.type && service.type.toLowerCase().includes(searchTermLower)) ||
          (service.description && service.description.toLowerCase().includes(searchTermLower)) ||
          (service.companyId?.name && service.companyId.name.toLowerCase().includes(searchTermLower))
        )
        .slice(0, 5)
        .map(service => ({
          id: service._id,
          type: 'service',
          title: service.name || 'Không có tên',
          subtitle: `${service.type || 'N/A'} - ${service.companyId?.name || 'N/A'}`,
          route: '/service'
        }));
      
      // Combine all results and limit to 10
      const combinedResults = [...taskResults, ...businessResults, ...serviceResults]
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 10);
      
      setSearchResults(combinedResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, tasks, businesses, services]);
  
  // Handle selection of a search result
  const handleSelectResult = (result) => {
    // Navigate to the appropriate route
    navigate(result.route);
    
    // Close search
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };
  
  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchOpen(prevState => !prevState);
    if (isSearchOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  return (
    <SearchContext.Provider 
      value={{ 
        searchTerm, 
        setSearchTerm, 
        searchResults, 
        isSearching,
        isSearchOpen,
        toggleSearch,
        handleSelectResult
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);