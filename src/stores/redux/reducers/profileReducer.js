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
  } from "../actions/types";

  const initialState = {
    profiles: null,
    profileSettings: {
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      timeZone: 'GMT+7',
      avatar: null
    },
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      teamUpdates: true,
      projectChanges: true
    },
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      lastPasswordChange: null
    },
    loading: false,
    error: null
  };

  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_PROFILE_LOADING:
        return {
          ...state,
          loading: true
        };

      case FETCH_PROFILE:
        return {
          ...state,
          profiles: action.payload,
          profileSettings: {
            name: action.payload.name || '',
            email: action.payload.email || '',
            phone: action.payload.phone || '',
            jobTitle: action.payload.jobTitle || '',
            department: action.payload.department || '',
            timeZone: action.payload.timeZone || 'GMT+7',
            avatar: action.payload.avatar || null
          },
          notificationSettings: action.payload.notifications ? {
            emailNotifications: action.payload.notifications.emailNotifications ?? true,
            pushNotifications: action.payload.notifications.pushNotifications ?? true,
            taskReminders: action.payload.notifications.taskReminders ?? true,
            teamUpdates: action.payload.notifications.teamUpdates ?? true,
            projectChanges: action.payload.notifications.projectChanges ?? true
          } : state.notificationSettings,
          securitySettings: action.payload.security ? {
            twoFactorAuth: action.payload.security.twoFactorAuth ?? false,
            sessionTimeout: action.payload.security.sessionTimeout || '30',
            lastPasswordChange: action.payload.updatedAt || null
          } : state.securitySettings,
          loading: false,
          error: null
        };

      case FETCH_PROFILE_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case UPDATE_PROFILE_STATE:
        return {
          ...state,
          profileSettings: {
            ...state.profileSettings,
            ...action.payload
          }
        };

      case UPDATE_NOTIFICATIONS_STATE:
        return {
          ...state,
          notificationSettings: {
            ...state.notificationSettings,
            ...action.payload
          }
        };

      case UPDATE_SECURITY_STATE:
        return {
          ...state,
          securitySettings: {
            ...state.securitySettings,
            ...action.payload
          }
        };

      // Các action này chỉ được gọi khi lưu thực sự
      case UPDATE_PROFILE:
        return {
          ...state,
          profileSettings: {
            ...state.profileSettings,
            ...action.payload
          },
          loading: false
        };

      case UPDATE_PROFILE_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case UPDATE_NOTIFICATIONS:
        return {
          ...state,
          notificationSettings: {
            ...state.notificationSettings,
            ...action.payload
          }
        };

      case UPDATE_SECURITY:
        return {
          ...state,
          securitySettings: {
            ...state.securitySettings,
            ...action.payload
          }
        };

      default:
        return state;
    }
  };

  export default profileReducer;