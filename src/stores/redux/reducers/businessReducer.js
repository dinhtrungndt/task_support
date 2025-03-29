import { ADD_BUSINESS, DELETE_BUSINESSES, FETCH_BUSINESSES, FETCH_BUSINESSES_ERROR, UPDATE_BUSINESS } from "../actions/types";

const initialState = {
  businesses: [],
  loading: true,
  error: null,
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BUSINESSES:
      return { ...state, businesses: action.payload, loading: false };
    case FETCH_BUSINESSES_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ADD_BUSINESS:
      return { ...state, businesses: [...state.businesses, action.payload] };
    case UPDATE_BUSINESS:
      return {
        ...state,
        businesses: state.businesses.map(business =>
          business._id === action.payload._id ? { ...business, ...action.payload } : business
        ),
      };
    case DELETE_BUSINESSES:
    return {
      ...state,
      businesses: state.businesses.filter(business => 
        !action.payload.includes(business._id)
      ),
    };
    default:
      return state;
  }
};

export default businessReducer;
