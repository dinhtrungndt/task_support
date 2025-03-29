import { combineReducers } from 'redux';
import businessReducer from './businessReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  business: businessReducer,
  tasks: taskReducer,
  users: userReducer
});

export default rootReducer;