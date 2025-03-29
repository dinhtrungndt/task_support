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
    console.log("Updating business with ID:", business._id);
    
    if (!business._id) {
      console.error("Business object is missing _id:", business);
      throw new Error("Business ID is missing or undefined");
    }
    
    const businessToUpdate = {
      mst: business.mst,
      name: business.name,
      address: business.address,
      connectionType: business.connectionType,
      PInstaller: business.PInstaller,
      codeData: business.codeData,
      typeData: business.typeData,
      AtSetting: business.AtSetting,
      // Optional fields
      contactPerson: business.contactPerson || '',
      phone: business.phone || '',
      email: business.email || '',
      dataTypes: business.dataTypes || [],
      // Add lastModified timestamp
      lastModified: new Date().toISOString()
    };

    const response = await axiosClient.put(`/city/${business._id}`, businessToUpdate);
    
    dispatch({
      type: UPDATE_BUSINESS,
      payload: {
        ...response.data,
        _id: business._id 
      }
    });
    
    // Return the updated business for the component
    return {
      ...response.data,
      _id: business._id
    };
  } catch (error) {
    console.error("Error updating business:", error);
    dispatch({
      type: FETCH_BUSINESSES_ERROR,
      payload: error.message || "Failed to update business"
    });
    throw error;
  }
};

// Delete businesses by their IDs
export const deleteBusinesses = (businessIds) => async (dispatch) => {
  try {
    const response = await axiosClient.delete('/city', { data: businessIds });
    
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
