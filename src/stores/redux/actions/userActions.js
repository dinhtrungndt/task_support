import {
  FETCH_USERS,
  FETCH_USERS_ERROR,
  FETCH_USERS_EXCEPT_ID,
  SET_CURRENT_USER,
} from "./types";
import { userService } from "../../../services/userService";

// Fetch all users
export const fetchUsers = () => async (dispatch) => {
  try {
    const data = await userService.fetchUsers();
    dispatch({
      type: FETCH_USERS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_ERROR,
      payload: error.message,
    });
  }
};

// Set current user (no API call)
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user,
});

// Fetch users except for a specific ID
export const fetchUsersExceptId = (userId) => async (dispatch) => {
  try {
    const data = await userService.fetchUsersExceptId(userId);
    dispatch({
      type: FETCH_USERS_EXCEPT_ID,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_ERROR,
      payload: error.message,
    });
  }
};