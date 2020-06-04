import {
  getRequest,
  postRequest,
  putRequest,
  // deleteRequest,
} from '../service';
import {
  requestStarted,
  requestFinished,
  requestFailed,
} from './apiActions';
import {
  setCookie,
  removeCookie,
} from '../../lib/cookieUtils';
import { JWT_COOKIE } from '../../constants/userConstants';

export const actionTypes = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  USER_AUTHENTICATE: 'USER_AUTHENTICATE',
  USER_CONFIRM_EMAIL: 'USER_CONFIRM_EMAIL',
  USER_FORGOT_PASSWORD: 'USER_FORGOT_PASSWORD',
};

export function userLogin({ email, password }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_LOGIN));

    const response = await postRequest('/users/login', {
      email,
      password,
    });
    if (response.error) {
      return dispatch(requestFailed(actionTypes.USER_LOGIN, response.error));
    }
    const { displayName, token } = response;
    setCookie(JWT_COOKIE, token);
    return dispatch(requestFinished(actionTypes.USER_LOGIN, { displayName }));
  };
}

export function userLogout() {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_LOGOUT));

    const response = await postRequest('/users/logout');
    if (response.error) {
      return dispatch(requestFailed(actionTypes.USER_LOGOUT, response.error));
    }
    // set cookie to null
    removeCookie(JWT_COOKIE);
    return dispatch(requestFinished(actionTypes.USER_LOGOUT));
  };
}

// TODO: data?
export function userRegister({ email, displayName, password }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_REGISTER));

    const response = await postRequest('/users/register', {
      email,
      displayName,
      password,
    });
    if (response.error) {
      return dispatch(requestFailed(actionTypes.USER_REGISTER, response.error));
    }
    return dispatch(requestFinished(actionTypes.USER_REGISTER, response.data));
  };
}

// TODO: response.data?
export function userConfirmEmail({ email }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_CONFIRM_EMAIL));

    const response = await putRequest('/users/confirmEmail', { email });
    if (response.error) {
      return dispatch(requestFailed(actionTypes.USER_CONFIRM_EMAIL, response.error));
    }
    return dispatch(requestFinished(actionTypes.USER_CONFIRM_EMAIL, response.data));
  };
}

// TODO: response.data?
export function userForgotPassword({ email }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_FORGOT_PASSWORD));
    const response = await getRequest('/users/forgot', { email });
    if (response.error) {
      return dispatch(requestFailed(actionTypes.USER_FORGOT_PASSWORD, response.error));
    }
    return dispatch(requestFinished(actionTypes.USER_FORGOT_PASSWORD, response.data));
  };
}
