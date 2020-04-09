import { combineReducers } from 'redux-immutable';
import registerPageReducer from './register_page';

// Combine all reducers and export them for store
const rootReducer = combineReducers({
  registerPage: registerPageReducer,
});

export default rootReducer;
