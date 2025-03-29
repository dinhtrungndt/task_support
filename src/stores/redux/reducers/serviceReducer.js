import { 
    FETCH_SERVICES, 
    FETCH_SERVICES_ERROR, 
    ADD_SERVICE, 
    UPDATE_SERVICE, 
    DELETE_SERVICE, 
    DELETE_SERVICES 
  } from "../actions/types";
  
  const initialState = {
    services: [],
    loading: true,
    error: null,
  };
  
  const serviceReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SERVICES:
        return { 
          ...state, 
          services: action.payload, 
          loading: false 
        };
        
      case FETCH_SERVICES_ERROR:
        return { 
          ...state, 
          error: action.payload, 
          loading: false 
        };
        
      case ADD_SERVICE:
        return { 
          ...state, 
          services: [...state.services, action.payload] 
        };
        
      case UPDATE_SERVICE:
        return {
          ...state,
          services: state.services.map(service =>
            service._id === action.payload._id ? { ...service, ...action.payload } : service
          ),
        };
        
      case DELETE_SERVICE:
        return {
          ...state,
          services: state.services.filter(service => service._id !== action.payload),
        };
        
      case DELETE_SERVICES:
        return {
          ...state,
          services: state.services.filter(service => 
            !action.payload.includes(service._id)
          ),
        };
        
      default:
        return state;
    }
  };
  
  export default serviceReducer;