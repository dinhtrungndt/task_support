import { FETCH_TASKS, FETCH_TASKS_ERROR } from './types';
import axiosClient from '../../../api/axiosClient.ts';

export const fetchTasks = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/city');
    const tasks = response.data.map(business => ({
      ...business,
      status: business.status || 'Pending'
    }));

    dispatch({
      type: FETCH_TASKS,
      payload: tasks,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
  }
};