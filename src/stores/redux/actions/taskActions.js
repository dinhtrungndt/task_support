import {
  FETCH_TASKS,
  FETCH_TASKS_ERROR,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  DELETE_TASKS,
} from "./types";
import taskService from "../../../services/taskService";

// Fetch all tasks
export const fetchTasks = () => async (dispatch) => {
  try {
    const data = await taskService.fetchTasks();
    dispatch({
      type: FETCH_TASKS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
  }
};

// Add a new task
export const addTask = (taskData, userId) => async (dispatch) => {
  try {
    const createdTask = await taskService.addTask(taskData, userId);
    dispatch({
      type: ADD_TASK,
      payload: createdTask,
    });
    return createdTask;
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
    const updatedTask = await taskService.updateTask(taskData);
    dispatch({
      type: UPDATE_TASK,
      payload: updatedTask,
    });
    return updatedTask;
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
    const data = await taskService.deleteTask(taskId);
    dispatch({
      type: DELETE_TASK,
      payload: taskId,
    });
    return data;
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
    await taskService.deleteTasks(taskIds);
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
    const data = await taskService.fetchTasksByCompany(companyId);
    dispatch({
      type: FETCH_TASKS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};