import { FETCH_TASKS, FETCH_TASKS_ERROR } from "../actions/types";

const initialState = {
  tasks: [],
  loading: true,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return { ...state, tasks: action.payload, loading: false };
    case FETCH_TASKS_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default taskReducer;