import { fromJS } from 'immutable';
import { actionTypes } from '../actions/apiActions';

const defaultState = {
  finished: false,
  pending: false,
  error: null,
};

const initialState = fromJS({
  userLoginState: defaultState,
  userLogoutState: defaultState,
  userRegisterState: defaultState,
  userGetState: defaultState,
  userValidateEmailState: defaultState,
  userForgotPasswordState: defaultState,
});

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.REQUEST_STARTED:
    return state.merge({
      [`${action.requestType}State`]: {
        finished: false,
        pending: true,
      },
    });
  case actionTypes.REQUEST_FINISHED:
    return state.merge({
      [`${action.requestType}State`]: {
        finished: true,
        pending: false,
      },
    });
  case actionTypes.REQUEST_FAILED:
    return state.merge({
      [`${action.requestType}State`]: {
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
