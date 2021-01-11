import { actionTypes } from '../actions/apiActions';
import { actionTypes as modalActionTypes } from '../actions/modalActions';
import { screamingToCamel } from '../../lib/utils';
import logger from '../../lib/logger';

const defaultState = {
  finished: false,
  pending: false,
  error: null,
  message: '',
};

const initialState = {
  userLoginState: defaultState,
  userLogoutState: defaultState,
  userRegisterState: defaultState,
  userAuthenticateState: defaultState,
  userVerifyEmailState: defaultState,
  userSendVerifyEmailState: defaultState,
  userResetPasswordState: defaultState,
  userSendResetPasswordEmailState: defaultState,
  userGetProfileState: defaultState,
  userUpdateProfileState: defaultState,
  userChangePasswordState: defaultState,
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
  case modalActionTypes.MODAL_CLOSE:
    return {
      ...initialState,
      userVerifyEmailState: { ...state.userVerifyEmailState },
    };
  case actionTypes.REQUEST_STARTED:
    return {
      ...state,
      [`${screamingToCamel(action.requestType)}State`]: {
        finished: false,
        pending: true,
      },
    };
  case actionTypes.REQUEST_FINISHED:
    return {
      ...state,
      [`${screamingToCamel(action.requestType)}State`]: {
        finished: true,
        pending: false,
        message: action?.data?.message,
      },
    };
  case actionTypes.REQUEST_FAILED:
    logger.error(action.error);
    return {
      ...state,
      [`${screamingToCamel(action.requestType)}State`]: {
        finished: true,
        pending: false,
        error: action?.error,
      },
    };
  default:
    return state;
  }
};

export default apiReducer;
