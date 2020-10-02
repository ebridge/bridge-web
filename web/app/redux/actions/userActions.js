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
import { closeModal } from './modalActions';
import {
  setCookie,
  removeCookie,
} from '../../lib/cookieUtils';
import { JWT_COOKIE } from '../../constants/userConstants';
import { objKeysToCamel } from '../../lib/utils';

export const actionTypes = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  USER_AUTHENTICATE: 'USER_AUTHENTICATE',
  USER_CONFIRM_EMAIL: 'USER_CONFIRM_EMAIL',
  USER_FORGOT_PASSWORD: 'USER_FORGOT_PASSWORD',
  USER_GET_PROFILE: 'USER_GET_PROFILE',
  USER_UPDATE_PROFILE: 'USER_UPDATE_PROFILE',
};

export function userLogin({ email, password, remember }) {
  const action = actionTypes.USER_LOGIN;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await postRequest('/users/login', {
      email,
      password,
      remember,
    });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    const { displayName, token } = response;
    setCookie(JWT_COOKIE, token, remember);
    dispatch(closeModal());
    return dispatch(requestFinished(action, { displayName }));
  };
}

export function userLogout() {
  const action = actionTypes.USER_LOGOUT;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await postRequest('/users/logout');
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    // set cookie to null
    removeCookie(JWT_COOKIE);
    return dispatch(requestFinished(action));
  };
}

export function userRegister({ email, displayName, password }) {
  const action = actionTypes.USER_REGISTER;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await postRequest('/users/register', {
      email,
      displayName,
      password,
    });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    dispatch(closeModal());
    return dispatch(requestFinished(action, response.data));
  };
}

export function userConfirmEmail({ email }) {
  const action = actionTypes.USER_CONFIRM_EMAIL;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await putRequest('/users/confirmEmail', { email });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response.data));
  };
}

export function userForgotPassword({ email }) {
  const action = actionTypes.USER_FORGOT_PASSWORD;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await getRequest('/users/forgot', { email });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response.data));
  };
}

export function userGetProfile(idOrDisplayName) {
  const action = actionTypes.USER_GET_PROFILE;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await getRequest(`/users/${idOrDisplayName}`);
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    const { user } = response;
    return dispatch(requestFinished(action, { user }));
  };
}


export function userUpdateProfile(idOrDisplayName, profile) {
  const action = actionTypes.USER_UPDATE_PROFILE;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await putRequest(`/users/${idOrDisplayName}`, { profile });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    const updatedProfile = response.profile;
    dispatch(requestFinished(action));
    return objKeysToCamel(updatedProfile);
    // return dispatch(requestFinished(action, { updatedProfile }));
  };
}
