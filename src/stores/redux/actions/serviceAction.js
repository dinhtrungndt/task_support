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
    console.log("Adding service:", service);
    
    // Đảm bảo các trường bắt buộc có giá trị
    const serviceToAdd = {
      ...service,
      price: service.price ? parseFloat(service.price) : 0,
      duration: service.duration ? parseInt(service.duration, 10) : 1,
      status: service.status || 'Active',
      features: service.features || []
    };
    
    // Thử gọi cả hai endpoint để đảm bảo một trong hai sẽ thành công
    let response;
    try {
      // Thử gọi endpoint /services
      response = await axiosClient.post('/services', serviceToAdd);
    } catch (error) {
      // Nếu gọi /services thất bại, thử gọi /services/add
      console.log("Trying alternative endpoint /services/add");
      response = await axiosClient.post('/services/add', serviceToAdd);
    }
    
    dispatch({
      type: ADD_SERVICE,
      payload: response.data,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error in addService action:", error.response?.data || error);
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
    // console.log("Bulk deleting services:", serviceIds);
    
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