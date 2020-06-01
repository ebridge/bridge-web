import Cookies from 'js-cookie';
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
import { JWT_COOKIE } from '../../constants/userConstants';

export const actionTypes = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  USER_GET: 'USER_GET',
  USER_VALIDATE_EMAIL: 'USER_VALIDATE_EMAIL',
  USER_FORGOT_PASSWORD: 'USER_FORGOT_PASSWORD',
};

export function userLogin({ email, password }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_LOGIN));

    const response = await postRequest('/users/login', {
      email,
      password,
    });
    if (!response.error) {
      Cookies.set(JWT_COOKIE, response.token, { expires: 1 });
      return dispatch(requestFinished(actionTypes.USER_LOGIN, response.data));
    }
    return dispatch(requestFailed(actionTypes.USER_LOGIN, response.error));
  };
}

export function userLogout() {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_LOGOUT));

    const response = await postRequest('/users/logout');
    if (!response.error) {
      // set cookie to null
      Cookies.remove(JWT_COOKIE);
      return dispatch(requestFinished(actionTypes.USER_LOGOUT, response.data));
    }
    return dispatch(requestFailed(actionTypes.USER_LOGOUT, response.error));
  };
}

export function userRegister({ email, displayName, password }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_REGISTER));

    const response = await postRequest('/users/register', {
      email,
      displayName,
      password,
    });
    if (!response.error) {
      return dispatch(requestFinished(actionTypes.USER_REGISTER, response.data));
    }
    return dispatch(requestFailed(actionTypes.USER_REGISTER, response.error));
  };
}

export function getUser() {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_GET));

    const response = await getRequest('/users/me');
    if (!response.error) {
      return dispatch(requestFinished(actionTypes.USER_GET, response.data));
    }
    return dispatch(requestFailed(actionTypes.USER_GET, response.error));
  };
}

export function userValidateEmail({ email }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_VALIDATE_EMAIL));

    const response = await putRequest('/users/validate', { email });
    if (!response.error) {
      return dispatch(requestFinished(actionTypes.USER_VALIDATE_EMAIL, response.data));
    }
    return dispatch(requestFailed(actionTypes.USER_VALIDATE_EMAIL, response.error));
  };
}

export function userForgotPassword({ email }) {
  return async dispatch => {
    dispatch(requestStarted(actionTypes.USER_FORGOT_PASSWORD));
    const response = await getRequest('/users/forgot', { email });
    if (!response.error) {
      return dispatch(requestFinished(actionTypes.USER_FORGOT_PASSWORD, response.data));
    }
    return dispatch(requestFailed(actionTypes.USER_FORGOT_PASSWORD, response.error));
  };
}
