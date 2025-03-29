import { ADD_BUSINESS, DELETE_BUSINESSES, FETCH_BUSINESSES, FETCH_BUSINESSES_ERROR, UPDATE_BUSINESS } from './types';
import axiosClient from '../../../api/axiosClient.ts';

// Fetch all businesses
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

// Add a new business
export const addBusiness = (business) => async (dispatch) => {
  try {
    const response = await axiosClient.post('/city', business);
    dispatch({
      type: ADD_BUSINESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
  }
};

// Update an existing business
export const updateBusiness = (business) => async (dispatch) => {
  try {
    const response = await axiosClient.put(`/city/${business.id}`, business);
    dispatch({
      type: UPDATE_BUSINESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
  }
};

// Delete businesses by their IDs
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
