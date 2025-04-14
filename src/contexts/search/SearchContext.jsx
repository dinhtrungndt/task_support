import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();

  const { tasks } = useSelector(state => state.tasks);
  const { businesses } = useSelector(state => state.business);
  const { services } = useSelector(state => state.services);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const debounceTimer = setTimeout(() => {
      const searchTermLower = searchTerm.toLowerCase();

      const taskResults = tasks
        .filter(task =>
          (task.companyId.name && task.companyId.name.toLowerCase().includes(searchTermLower)) ||
          (task.companyId.mst && task.companyId.mst.toLowerCase().includes(searchTermLower)) ||
          (task.companyId.address && task.companyId.address.toLowerCase().includes(searchTermLower)) ||
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
          title: task.companyId.name || 'Không có tên',
          subtitle: `MST: ${task.companyId.mst || 'N/A'} - ${task.status || 'Pending'}`,
          route: '/task',
          data: task
        }));

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
          route: '/business',
          data: business
        }));

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
          route: '/service',
          data: service
        }));

      const combinedResults = [...taskResults, ...businessResults, ...serviceResults]
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 10);

      setSearchResults(combinedResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, tasks, businesses, services]);

  const handleSelectResult = (result) => {
    setSelectedItem(result.data);

    navigate(result.route, {
      state: {
        selectedItemId: result.id,
        selectedItemType: result.type,
        showDetails: true
      }
    });

    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

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
        handleSelectResult,
        selectedItem,
        setSelectedItem
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);