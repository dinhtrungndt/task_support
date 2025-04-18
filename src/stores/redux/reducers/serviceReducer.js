import {
  FETCH_SERVICES,
  FETCH_SERVICES_ERROR,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
  DELETE_SERVICES,
  FETCH_SERVICES_BY_USER
} from "../actions/types";

const initialState = {
  services: [],
  loading: true,
  error: null,
};

const normalizeService = (service) => {
  const normalized = { ...service };

  if (normalized.userCreated && typeof normalized.userCreated === 'object') {
    normalized._userCreatedObj = normalized.userCreated;
  }

  if (normalized.companyId && typeof normalized.companyId === 'object') {
    normalized._companyIdObj = normalized.companyId;
  }

  return normalized;
};

const serviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SERVICES:
      return {
        ...state,
        services: action.payload.map(service => normalizeService(service)),
        loading: false
      };

    case FETCH_SERVICES_BY_USER:
      return {
        ...state,
        services: action.payload.map(service => normalizeService(service)),
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
        services: [...state.services, normalizeService(action.payload)]
      };

    case UPDATE_SERVICE: {
      const updatedService = normalizeService(action.payload);

      return {
        ...state,
        services: state.services.map(service =>
          service._id === updatedService._id ? updatedService : service
        ),
      };
    }

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