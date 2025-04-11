import {
  ADD_BUSINESS,
  DELETE_BUSINESSES,
  FETCH_BUSINESSES,
  FETCH_BUSINESSES_ERROR,
  UPDATE_BUSINESS,
} from "./types";
import axiosClient from "../../../api/axiosClient";

export const fetchBusinesses = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/companies");
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
    // Format data for the new Company model
    const businessToAdd = {
      mst: business.mst,
      name: business.name,
      address: business.address,
    };

    const response = await axiosClient.post("/companies/add", businessToAdd);
    dispatch({
      type: ADD_BUSINESS,
      payload: response.data,
    });

    return response.data;
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
    if (!business._id) {
      console.error("Business object is missing _id:", business);
      throw new Error("Business ID is missing or undefined");
    }

    // Format data for the new Company model
    const businessToUpdate = {
      mst: business.mst,
      name: business.name,
      address: business.address,
      // The API only accepts these specific fields
    };

    const response = await axiosClient.put(
      `/companies/${business._id}`,
      businessToUpdate
    );

    dispatch({
      type: UPDATE_BUSINESS,
      payload: {
        ...response.data,
        _id: business._id,
      },
    });

    // Return the updated business for the component
    return {
      ...response.data,
      _id: business._id,
    };
  } catch (error) {
    console.error("Error updating business:", error);
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message || "Failed to update business",
    });
    throw error;
  }
};

// Delete businesses by their IDs
export const deleteBusinesses = (businessIds) => async (dispatch) => {
  try {
    // Updated API endpoint
    const response = await axiosClient.delete("/companies", {
      data: businessIds,
    });

    dispatch({
      type: DELETE_BUSINESSES,
      payload: businessIds,
    });

    return response;
  } catch (error) {
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message,
    });
    throw error;
  }
};
