import React, { useEffect, useState } from 'react'
import { HeaderPages } from '../../components/header'
import { TaskData } from '../../stores/data/task.task';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { TodayTasks } from './todayTask';
import { Tasks } from '../../components/Tasks';

export const OverviewPages = () => {
  const [activeFilter, setActiveFilter] = useState('Assigned');
  const [filteredTasks, setFilteredTasks] = useState(TaskData);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  
  useEffect(() => {
    filterTasks();
  }, [activeFilter]);
  
  const filterTasks = () => {
    let results = TaskData;
    if (activeFilter !== 'Assigned') {
      const statusMap = {
        Done: 'Done',
        Pending: 'Pending',
        rejected: 'Rejected',
        Assigned: 'Assigned'
      };
      if (statusMap[activeFilter]) {
        results = results.filter(task => task.status === statusMap[activeFilter]);
      }
    }
    setFilteredTasks(results);
  };
  
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };
  
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };
  
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
    setActiveDropdown(null);
  };
  
  const handleMoreOptions = (task) => {
    setSelectedTask(task);
    setMoreModalOpen(true);
    setActiveDropdown(null);
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(task => task.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };
  
  const handleSaveTask = (updatedTask) => {
    console.log('Saving updated task:', updatedTask);
    // Thực hiện logic cập nhật task
    // Ví dụ:
    // const updatedTasks = filteredTasks.map(task => 
    //   task.mst === updatedTask.mst ? updatedTask : task
    // );
    // setFilteredTasks(updatedTasks);
    setEditModalOpen(false);
  };
  
  return (
    <div className='Main'>
      {/* header */}
      <HeaderPages title="Overview" />
      {/* <hr className='my-4'/> */}
      {/* body */}
      <div>
        <div className='flex gap-4 pb-2'> 
          <p 
            className={`${activeFilter === 'Assigned' ? 'text-xs font-bold text-teal-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`}
            onClick={() => handleFilterClick('Assigned')}>Assigned Task's</p>
          <p 
            className={`${activeFilter === 'Done' ? 'text-xs font-bold text-indigo-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`} 
            onClick={() => handleFilterClick('Done')}>Done</p>
          <p 
            className={`${activeFilter === 'Pending' ? 'text-xs font-bold text-green-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`}
            onClick={() => handleFilterClick('Pending')}>Pending</p>
          <p 
            className={`${activeFilter === 'rejected' ? 'text-xs font-bold text-red-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`}
            onClick={() => handleFilterClick('rejected')}>rejected</p>
        </div>
      </div>
      
      { activeFilter === 'Assigned' ? (
        <div>
          <TodayTasks />
        </div>
      ) : activeFilter === 'all' ? (
        <div className='bg-white rounded-md shadow-md p-4'>
          <p className='text-xl font-bold pt-2'>Today's Action</p>
        </div>
      ) : (
        <Tasks
          filteredTasks={filteredTasks}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedIds={selectedIds}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          handleCheckboxChange={handleCheckboxChange}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          handleEditTask={handleEditTask}
          handleMoreOptions={handleMoreOptions}
          openModalCreateTask={openModalCreateTask}
          setOpenModalCreateTask={setOpenModalCreateTask}
        />
      )}
      
      {/* Edit Task Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Chỉnh sửa thông tin"
      >
        <EditTaskModal
          task={selectedTask}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveTask}
        />
      </Modal>
      
      {/* More Details Modal */}
      <Modal
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        title="Chi tiết công việc"
      >
        <MoreDetailsModal task={selectedTask} />
      </Modal>
    </div>
  )
}