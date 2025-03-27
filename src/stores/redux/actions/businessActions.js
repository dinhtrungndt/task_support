import { DELETE_BUSINESSES, FETCH_BUSINESSES, FETCH_BUSINESSES_ERROR } from './types';
import axiosClient from '../../../api/axiosClient.ts';

export const fetchBusinesses = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/city');
    dispatch({
      type: FETCH_BUSINESSES,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
  }
};

export const deleteBusinesses = (businessIds) => async (dispatch) => {
  try {
    const response = await axiosClient.delete('/city', { data: businessIds });
    dispatch({
      type: DELETE_BUSINESSES,
      payload: response.data.deletedCity,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
  }
};
