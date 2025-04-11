import { combineReducers } from 'redux';
import businessReducer from './businessReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';
import serviceReducer from './serviceReducer';
import messageReducer from './messageReducer';

const rootReducer = combineReducers({
  business: businessReducer,
  tasks: taskReducer,
  users: userReducer,
  services: serviceReducer,
  messages: messageReducer,
});

export default rootReducer;