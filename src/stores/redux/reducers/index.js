import { combineReducers } from 'redux';
import businessReducer from './businessReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';
import serviceReducer from './serviceReducer';
import messageReducer from './messageReducer';
import profileReducer from './profileReducer';

const rootReducer = combineReducers({
  business: businessReducer,
  tasks: taskReducer,
  users: userReducer,
  services: serviceReducer,
  messages: messageReducer,
  profiles: profileReducer,
});

export default rootReducer;