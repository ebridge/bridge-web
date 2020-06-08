import { fromJS } from 'immutable';
import { actionTypes } from '../actions/apiActions';
import { actionTypes as modalActionTypes } from '../actions/modalActions';
import { screamingToCamel } from '../../lib/utils';

const defaultState = {
  finished: false,
  pending: false,
  error: null,
};

const initialState = fromJS({
  userLoginState: defaultState,
  userLogoutState: defaultState,
  userRegisterState: defaultState,
  userAuthenticateState: defaultState,
  userConfirmEmailState: defaultState,
  userForgotPasswordState: defaultState,
  userGetProfileState: defaultState,
  userUpdateProfileState: defaultState,
});

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
  case modalActionTypes.MODAL_CLOSE:
    return initialState;
  case actionTypes.REQUEST_STARTED:
    return state.merge({
      [`${screamingToCamel(action.requestType)}State`]: {
        finished: false,
        pending: true,
      },
    });
  case actionTypes.REQUEST_FINISHED:
    return state.merge({
      [`${screamingToCamel(action.requestType)}State`]: {
        finished: true,
        pending: false,
      },
    });
  case actionTypes.REQUEST_FAILED:
    return state.merge({
      [`${screamingToCamel(action.requestType)}State`]: {
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
