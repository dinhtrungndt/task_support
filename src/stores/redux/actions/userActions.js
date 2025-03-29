import { FETCH_USERS, FETCH_USERS_ERROR } from './types';
import axiosClient from '../../../api/axiosClient.ts';

// Fetch all users
export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/users');
    
    dispatch({
      type: FETCH_USERS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_ERROR,
      payload: error.message,
    });
  }
};