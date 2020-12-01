import { combineReducers } from 'redux';
import registerReducer from './registerReducer';
import loginReducer from './loginReducer';
import forgotPasswordReducer from './forgotPasswordReducer';
import resetPasswordReducer from './resetPasswordReducer';
import modalsReducer from './modalsReducer';
import apiReducer from './apiReducer';
import userReducer from './userReducer';
import roomsReducer from './roomsReducer';
import chatReducer from './chatReducer';
import profileReducer from './profileReducer';

// Combine all reducers and export them for store
const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  modals: modalsReducer,
  api: apiReducer,
  user: userReducer,
  rooms: roomsReducer,
  chat: chatReducer,
  profile: profileReducer,
});

export default rootReducer;
