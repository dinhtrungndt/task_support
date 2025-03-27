import { combineReducers } from 'redux';
import businessReducer from './businessReducer';

export default combineReducers({
  business: businessReducer,
});
