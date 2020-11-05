import { combineReducers } from 'redux';
import registerReducer from './registerReducer';
import loginReducer from './loginReducer';
import forgotReducer from './forgotReducer';
import modalsReducer from './modalsReducer';
import apiReducer from './apiReducer';
import userReducer from './userReducer';
import roomsReducer from './roomsReducer';
import chatReducer from './chatReducer';

// Combine all reducers and export them for store
const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  forgot: forgotReducer,
  modals: modalsReducer,
  api: apiReducer,
  user: userReducer,
  rooms: roomsReducer,
  chat: chatReducer,
});

export default rootReducer;
