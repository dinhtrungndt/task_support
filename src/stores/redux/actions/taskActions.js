import { 
  FETCH_TASKS, 
  FETCH_TASKS_ERROR, 
  ADD_TASK, 
  UPDATE_TASK, 
  DELETE_TASK, 
  DELETE_TASKS 
} from './types';
import axiosClient from '../../../api/axiosClient.ts';

// Fetch all tasks
export const fetchTasks = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/tasks');
    
    dispatch({
      type: FETCH_TASKS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
  }
};

// Add a new task
export const addTask = (taskData) => async (dispatch) => {
  try {
    // Format data for the updated Task model
    const taskToAdd = {
      mst: taskData.mst || '',
      companyName: taskData.name || taskData.companyName || '', 
      address: taskData.address || '',
      connectionType: taskData.connectionType || '',
      installer: taskData.PInstaller || taskData.installer || '', 
      codeData: taskData.codeData || '',
      typeData: taskData.typeData || 'Data',
      installDate: taskData.AtSetting || taskData.installDate || new Date().toISOString(), 
      status: taskData.status || 'Pending',
      notes: taskData.cancellationReason || taskData.notes || '',
      companyId: taskData.companyId || taskData.businessId // Make sure the company ID is passed
    };

    // Use the updated endpoint
    const response = await axiosClient.post('/tasks/add', taskToAdd);
    
    dispatch({
      type: ADD_TASK,
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Update an existing task
export const updateTask = (taskData) => async (dispatch) => {
  try {
    if (!taskData._id) {
      throw new Error("Task ID is required for update");
    }
    
    // Prepare data according to the updated Task model
    const taskToUpdate = {
      mst: taskData.mst || '',
      companyName: taskData.name || taskData.companyName || '', 
      address: taskData.address || '',
      connectionType: taskData.connectionType || '',
      installer: taskData.PInstaller || taskData.installer || '', 
      codeData: taskData.codeData || '',
      typeData: taskData.typeData || 'Data',
      installDate: taskData.AtSetting || taskData.installDate || new Date().toISOString(), 
      status: taskData.status || 'Pending',
      notes: taskData.cancellationReason || taskData.notes || ''
    };

    // Use the updated endpoint
    const response = await axiosClient.put(`/tasks/${taskData._id}`, taskToUpdate);
    
    dispatch({
      type: UPDATE_TASK,
      payload: {
        ...response.data,
        _id: taskData._id // Ensure ID is in the response
      }
    });
    
    return {
      ...response.data,
      _id: taskData._id
    };
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Delete a single task
export const deleteTask = (taskId) => async (dispatch) => {
  try {
    // Use the updated endpoint
    const response = await axiosClient.delete(`/tasks/${taskId}`);
    
    dispatch({
      type: DELETE_TASK,
      payload: taskId,
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Delete multiple tasks
export const deleteTasks = (taskIds) => async (dispatch) => {
  try {
    // Use the updated endpoint
    await axiosClient.delete('/tasks', { data: taskIds });
    
    dispatch({
      type: DELETE_TASKS,
      payload: taskIds,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Fetch tasks for a specific company
export const fetchTasksByCompany = (companyId) => async (dispatch) => {
  try {
    const response = await axiosClient.get(`/companies/${companyId}/tasks`);
    
    dispatch({
      type: FETCH_TASKS,
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};