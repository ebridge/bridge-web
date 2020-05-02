import { combineReducers } from 'redux-immutable';
import registerReducer from './registerReducer';
import loginReducer from './loginReducer';
import forgotReducer from './forgotReducer';


// Combine all reducers and export them for store
const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  forgot: forgotReducer,
});

export default rootReducer;
