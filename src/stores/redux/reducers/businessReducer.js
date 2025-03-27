import { DELETE_BUSINESSES, FETCH_BUSINESSES, FETCH_BUSINESSES_ERROR } from "../actions/types";

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
      case DELETE_BUSINESSES:
        return {
          ...state,
          businesses: state.businesses.filter(business => !action.payload.some(deleted => deleted._id === business._id)),
        };
    default:
      return state;
  }
};

export default businessReducer;
