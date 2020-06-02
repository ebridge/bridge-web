import { combineReducers } from 'redux-immutable';
import registerReducer from './registerReducer';
import loginReducer from './loginReducer';
import forgotReducer from './forgotReducer';
import modalsReducer from './modalsReducer';
import apiReducer from './apiReducer';
import userReducer from './userReducer';


// Combine all reducers and export them for store
const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  forgot: forgotReducer,
  modals: modalsReducer,
  api: apiReducer,
  user: userReducer,
});

export default rootReducer;
