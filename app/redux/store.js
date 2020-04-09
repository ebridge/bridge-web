import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

// Logger that accounts for immutable JS objects
const loggerMiddleware = createLogger({
  collapsed: true,
  stateTransformer: (state) => state.toJS(),
});

// TODO: only enable composeWithDevTools in dev env
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware);
const makeStore = () => createStore(reducers, middleware);

export default makeStore;
