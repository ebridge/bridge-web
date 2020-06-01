import { fromJS } from 'immutable';
import { actionTypes } from '../actions/apiActions';

const defaultState = {
  finished: false,
  pending: false,
  error: null,
};

const initialState = fromJS({
  USER_LOGIN_STATE: defaultState,
  USER_LOGOUT_STATE: defaultState,
  USER_REGISTER_STATE: defaultState,
  USER_GET_STATE: defaultState,
  USER_VALIDATE_EMAIL_STATE: defaultState,
  USER_FORGOT_PASSWORD_STATE: defaultState,
});

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.REQUEST_STARTED:
    return state.merge({
      [`${action.requestType}_STATE`]: {
        finished: false,
        pending: true,
      },
    });
  case actionTypes.REQUEST_FINISHED:
    return state.merge({
      [`${action.requestType}_STATE`]: {
        finished: true,
        pending: false,
      },
    });
  case actionTypes.REQUEST_FAILED:
    return state.merge({
      [`${action.requestType}_STATE`]: {
        finished: true,
        pending: false,
        error: action.error,
      },
    });
  default:
    return state;
  }
};

export default apiReducer;
