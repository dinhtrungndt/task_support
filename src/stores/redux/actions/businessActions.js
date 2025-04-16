import {
  ADD_BUSINESS,
  DELETE_BUSINESSES,
  FETCH_BUSINESSES,
  FETCH_BUSINESSES_ERROR,
  UPDATE_BUSINESS,
} from "./types";
import businessService from "../../../services/businessService";

// Fetch all businesses
export const fetchBusinesses = () => async (dispatch) => {
  try {
    const data = await businessService.fetchBusinesses();
    dispatch({
      type: FETCH_BUSINESSES,
      payload: data,
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
    const data = await businessService.addBusiness(business);
    dispatch({
      type: ADD_BUSINESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Update an existing business
export const updateBusiness = (business) => async (dispatch) => {
  try {
    const data = await businessService.updateBusiness(business);
    dispatch({
      type: UPDATE_BUSINESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message || "Failed to update business",
    });
    throw error;
  }
};

// Delete businesses
export const deleteBusinesses = (businessIds) => async (dispatch) => {
  try {
    const data = await businessService.deleteBusinesses(businessIds);
    dispatch({
      type: DELETE_BUSINESSES,
      payload: businessIds,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
    throw error;
  }
};