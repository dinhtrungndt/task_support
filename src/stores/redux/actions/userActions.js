import { FETCH_USERS, FETCH_USERS_ERROR, FETCH_USERS_EXCEPT_ID } from "./types";
import axiosClient from "../../../api/axiosClient";

// Fetch all users
export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/users");

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

// Fetch users except for a specific ID
export const fetchUsersExceptId = (userId) => async (dispatch) => {
  try {
    const response = await axiosClient.get(`/users/get-users-except-id/${userId}`);
    dispatch({
      type: FETCH_USERS_EXCEPT_ID,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_ERROR,
      payload: error.message,
    });
  }
};
