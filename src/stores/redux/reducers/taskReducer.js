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
      const newTask = action.payload;
      if (!newTask.companyId || typeof newTask.companyId !== 'object') {
        const company = state.businesses?.find(b => b._id === newTask.companyId);
        if (company) {
          newTask.companyId = {
            _id: company._id,
            mst: company.mst,
            name: company.name,
            address: company.address
          };
        }
      }
      return {
        ...state,
        tasks: [...state.tasks, newTask]
      };

    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task._id === action.payload._id) {
            const updatedTask = {
              ...task,
              ...action.payload
            };

            if (!updatedTask.companyId || (typeof updatedTask.companyId !== 'object' && task.companyId && typeof task.companyId === 'object')) {
              updatedTask.companyId = task.companyId;
            }

            return updatedTask;
          }
          return task;
        }),
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