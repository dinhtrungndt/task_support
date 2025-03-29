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

// Add a new task with user ID directly passed from component
export const addTask = (taskData, userId) => async (dispatch) => {
  try {
    if (!userId) {
      throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    }
    
    // Make sure installer and codeData have values since they're required
    const taskToAdd = {
      mst: taskData.mst || '',
      companyName: taskData.name || taskData.companyName || '', 
      address: taskData.address || '',
      connectionType: taskData.connectionType || '',
      installer: taskData.PInstaller || taskData.installer || 'N/A', // Default value for required field
      codeData: taskData.codeData || 'N/A', // Default value for required field
      typeData: taskData.typeData || 'Data',
      installDate: taskData.AtSetting || taskData.installDate || new Date().toISOString(), 
      status: taskData.status || 'Pending',
      notes: taskData.cancellationReason || taskData.notes || '',
      companyId: taskData.companyId || taskData.businessId, // Make sure the company ID is passed
      userAdd: userId // Add the user ID passed from the component
    };

    // console.log("Sending task data:", taskToAdd);

    // Changed from '/tasks/add' to '/tasks'
    const response = await axiosClient.post('/tasks', [taskToAdd]); // Notice we wrap in array for POST /tasks
    
    dispatch({
      type: ADD_TASK,
      payload: response.data[0], // Get the first item from the array response
    });
    
    return response.data[0]; // Return the first created task
  } catch (error) {
    console.error("Add task error details:", error.response?.data || error);
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
      installer: taskData.PInstaller || taskData.installer || 'N/A', // Default value 
      codeData: taskData.codeData || 'N/A', // Default value
      typeData: taskData.typeData || 'Data',
      installDate: taskData.AtSetting || taskData.installDate || new Date().toISOString(), 
      status: taskData.status || 'Pending',
      notes: taskData.cancellationReason || taskData.notes || '',
      userAdd: taskData.userAdd // Keep the original user who created the task
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