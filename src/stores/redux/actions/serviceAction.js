import {
  FETCH_SERVICES,
  FETCH_SERVICES_ERROR,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
  DELETE_SERVICES,
} from "./types";
import serviceService from "../../../services/serviceService";

// Fetch all services
export const fetchServices = () => async (dispatch) => {
  try {
    const data = await serviceService.fetchServices();
    dispatch({
      type: FETCH_SERVICES,
      payload: data,
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
    const data = await serviceService.addService(service);
    dispatch({
      type: ADD_SERVICE,
      payload: data,
    });
    return data;
  } catch (error) {
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
    const data = await serviceService.updateService(service);
    dispatch({
      type: UPDATE_SERVICE,
      payload: data,
    });

    dispatch(fetchServices());

    return data;
  } catch (error) {
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
    const data = await serviceService.deleteService(serviceId);
    dispatch({
      type: DELETE_SERVICE,
      payload: serviceId,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Delete multiple services
export const deleteServices = (serviceIds) => async (dispatch) => {
  try {
    const data = await serviceService.deleteServices(serviceIds);
    dispatch({
      type: DELETE_SERVICES,
      payload: serviceIds,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_SERVICES_ERROR,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};