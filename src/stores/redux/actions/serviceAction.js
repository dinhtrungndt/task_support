import {
  FETCH_SERVICES,
  FETCH_SERVICES_ERROR,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
  DELETE_SERVICES
} from './types';
import axiosClient from '../../../api/axiosClient.ts';

// Fetch all services
export const fetchServices = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/services');
    dispatch({
      type: FETCH_SERVICES,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add a new service
export const addService = (service) => async (dispatch) => {
  try {
    console.log("Adding service with data:", service);
    
    // Send all data to the backend
    const response = await axiosClient.post('/services/add', service);
    
    dispatch({
      type: ADD_SERVICE,
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error in addService action:", error);
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Update an existing service
export const updateService = (service) => async (dispatch) => {
  try {
    if (!service._id) {
      console.error("Service object is missing _id:", service);
      throw new Error("Service ID is missing or undefined");
    }
    
    console.log("Updating service:", service);
    
    const response = await axiosClient.put(`/services/${service._id}`, service);
    
    dispatch({
      type: UPDATE_SERVICE,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Delete a service by ID
export const deleteService = (serviceId) => async (dispatch) => {
  try {
    console.log("Deleting service:", serviceId);
    
    const response = await axiosClient.delete(`/services/${serviceId}`);
    
    dispatch({
      type: DELETE_SERVICE,
      payload: serviceId,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Delete multiple services by their IDs
export const deleteServices = (serviceIds) => async (dispatch) => {
  try {
    console.log("Bulk deleting services:", serviceIds);
    
    const response = await axiosClient.delete('/services', { data: serviceIds });
    
    dispatch({
      type: DELETE_SERVICES,
      payload: serviceIds,
    });
    
    return response.data; 
  } catch (error) {
    console.error("Error bulk deleting services:", error);
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};