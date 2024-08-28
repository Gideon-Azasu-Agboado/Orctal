import { combineReducers } from 'redux';
import personalInfoReducer from './userDataSlice';
import bookingsReducer from './bookingsSlice';

export default rootReducer =  combineReducers({
  personalInfo: personalInfoReducer,
  bookingsData: bookingsReducer
})