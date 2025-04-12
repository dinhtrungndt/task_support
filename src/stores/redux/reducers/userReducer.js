import { FETCH_USERS, FETCH_USERS_ERROR, FETCH_USERS_EXCEPT_ID, SET_CURRENT_USER } from '../actions/types';

const initialState = {
  users: [],
  currentUser: {},
  loading: true,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case FETCH_USERS_EXCEPT_ID:
      return {
        ...state,
        users: action.payload,
        loading: false
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        loading: false
      };

    case FETCH_USERS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

export default userReducer;
