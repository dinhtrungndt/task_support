import { 
  FETCH_TASKS, 
  FETCH_TASKS_ERROR, 
  ADD_TASK, 
  UPDATE_TASK, 
  DELETE_TASK, 
  DELETE_TASKS 
} from "../actions/types";

const initialState = {
  tasks: [],
  loading: true,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return { 
        ...state, 
        tasks: action.payload, 
        loading: false 
      };
      
    case FETCH_TASKS_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
      
    case ADD_TASK:
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload] 
      };
      
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? { ...task, ...action.payload } : task
        ),
      };
      
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
      };
      
    case DELETE_TASKS:
      return {
        ...state,
        tasks: state.tasks.filter(task => !action.payload.includes(task._id)),
      };
      
    default:
      return state;
  }
};

export default taskReducer;