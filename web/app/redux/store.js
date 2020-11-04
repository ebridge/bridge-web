import { createStore, applyMiddleware } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const isDevEnv = process.env.NODE_ENV !== 'production';

const loggerMiddleware = createLogger({
  collapsed: true,
  predicate: (getState, action) => {
    if (action.type === HYDRATE) {
      return false;
    }
    return true;
  },
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  }
  return rootReducer(state, action);
};

const middlewares = [thunkMiddleware];

if (isDevEnv) {
  middlewares.push(loggerMiddleware);
}

let middleware = applyMiddleware(...middlewares);
if (isDevEnv) {
  middleware = composeWithDevTools(middleware);
}

const initStore = () => createStore(reducer, middleware);

const wrapper = createWrapper(initStore, {
  debug: false,
});

export default wrapper;
