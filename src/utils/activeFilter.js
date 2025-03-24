import React, { useEffect, useState } from 'react'

export const ActiveFilter = ({ TaskData, setFilteredTasks, searchTerm }) => {
  const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

   // Tìm kiếm và lọc dữ liệu
    useEffect(() => {
      filterTasks();
    }, [searchTerm, activeFilter]);
  
    const filterTasks = () => {
      let results = TaskData;
  
      // Lọc theo trạng thái nếu không phải 'all'
      if (activeFilter !== 'all') {
        const statusMap = {
          Done: 'Done',
          Pending: 'Pending',
          rejected: 'Rejected'
        };
        results = results.filter(task => task.status === statusMap[activeFilter]);
      }
  
      // Lọc theo từ khóa tìm kiếm
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        results = results.filter(task =>
          task.mst.toLowerCase().includes(term) ||
          task.name.toLowerCase().includes(term) ||
          task.address.toLowerCase().includes(term) ||
          task.connectionType.toLowerCase().includes(term) ||
          task.PInstaller.toLowerCase().includes(term) ||
          task.codeData.toLowerCase().includes(term) ||
          task.typeData.toLowerCase().includes(term) ||
          (task.userId.name && task.userId.name.toLowerCase().includes(term))
        );
      }
  
      setFilteredTasks(results);
    };
  
    const handleFilterClick = (filter) => {
      setActiveFilter(filter);
    };

  return (
    <div>
        <div className='flex gap-4 pb-2'>
            <p
            className={`text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer ${
                activeFilter === 'all' ? 'text-indigo-600' : ''
            }`}
            onClick={() => handleFilterClick('all')}
            >
            All
            </p>
            <p
            className={`text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer ${
                activeFilter === 'Done' ? 'text-indigo-600' : ''
            }`}
            onClick={() => handleFilterClick('Done')}
            >
            Done
            </p>
            <p
            className={`text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer ${
                activeFilter === 'Pending' ? 'text-indigo-600' : ''
            }`}
            onClick={() => handleFilterClick('Pending')}
            >
            Pending
            </p>
            <p
            className={`text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer ${
                activeFilter === 'Rejected' ? 'text-indigo-600' : ''
            }`}
            onClick={() => handleFilterClick('Rejected')}
            >
            Rejected
            </p>
        </div>
    </div>
  )
}
