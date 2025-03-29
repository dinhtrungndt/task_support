import { combineReducers } from 'redux';
import businessReducer from './businessReducer';
import taskReducer from './taskReducer';

export default combineReducers({
  business: businessReducer,
  tasks: taskReducer, 
});
