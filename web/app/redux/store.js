import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

// const isDevEnv = process.env.NODE_ENV === 'Development';

// Logger that accounts for immutable JS objects
const loggerMiddleware = createLogger({
  collapsed: true,
  stateTransformer: (state) => state.toJS(),
});

// TODO: only enable composeWithDevTools in dev env
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware);
const store = () => createStore(rootReducer, composeWithDevTools(middleware));

export default store;
