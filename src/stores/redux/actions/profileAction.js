import { profileService } from "../../../services/profileService";
import {
  FETCH_PROFILE,
  FETCH_PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_ERROR,
  UPDATE_NOTIFICATIONS,
  UPDATE_SECURITY,
  SET_PROFILE_LOADING,
  UPDATE_PROFILE_STATE,
  UPDATE_NOTIFICATIONS_STATE,
  UPDATE_SECURITY_STATE
} from "./types";
import { toast } from 'react-toastify';

// Set profile loading state
export const setProfileLoading = () => ({
  type: SET_PROFILE_LOADING
});

// Fetch profile
export const fetchProfile = () => async (dispatch) => {
  dispatch(setProfileLoading());
  try {
    const response = await profileService.fetchProfile();

    if (response && response.status === 200) {
      dispatch({
        type: FETCH_PROFILE,
        payload: response.user
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_PROFILE_ERROR,
      payload: error.message
    });
    toast.error('Không thể tải thông tin cài đặt. Vui lòng thử lại sau.');
  }
};

// Chỉ cập nhật state mà không gọi API
export const updateProfileState = (profileData) => ({
  type: UPDATE_PROFILE_STATE,
  payload: profileData
});

export const updateNotificationsState = (notificationData) => ({
  type: UPDATE_NOTIFICATIONS_STATE,
  payload: notificationData
});

export const updateSecurityState = (securityData) => ({
  type: UPDATE_SECURITY_STATE,
  payload: securityData
});

// Update profile information (gọi API)
export const updateProfile = (profileData) => async (dispatch) => {
  dispatch(setProfileLoading());
  try {
    const response = await profileService.updateProfile(profileData);

    if (response && response.status === 200) {
      dispatch({
        type: UPDATE_PROFILE,
        payload: profileData
      });
      return true;
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_ERROR,
      payload: error.message
    });
    toast.error('Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.');
    return false;
  }
};

// Update notification settings (gọi API)
export const updateNotifications = (notificationData) => async (dispatch) => {
  try {
    const response = await profileService.updateNotifications(notificationData);

    if (response && response.status === 200) {
      dispatch({
        type: UPDATE_NOTIFICATIONS,
        payload: notificationData
      });
      return true;
    }
  } catch (error) {
    toast.error('Không thể cập nhật thông báo. Vui lòng thử lại sau.');
    return false;
  }
};

// Update security settings (gọi API)
export const updateSecurity = (securityData) => async (dispatch) => {
  try {
    const response = await profileService.updateSecurity(securityData);

    if (response && response.status === 200) {
      dispatch({
        type: UPDATE_SECURITY,
        payload: securityData
      });
      return true;
    }
  } catch (error) {
    toast.error('Không thể cập nhật bảo mật. Vui lòng thử lại sau.');
    return false;
  }
};
