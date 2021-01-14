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
  USER_VERIFY_EMAIL: 'USER_VERIFY_EMAIL',
  USER_SEND_VERIFY_EMAIL: 'USER_SEND_VERIFY_EMAIL',
  USER_RESET_PASSWORD: 'USER_RESET_PASSWORD',
  USER_SEND_RESET_PASSWORD_EMAIL: 'USER_SEND_RESET_PASSWORD_EMAIL',
  USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
  USER_GET_PROFILE: 'USER_GET_PROFILE',
  USER_UPDATE_PROFILE: 'USER_UPDATE_PROFILE',
  USER_SET_PROFILE_PICTURE_URL: 'USER_SET_PROFILE_PICTURE_URL',
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
    const { id, displayName, token } = response;
    setCookie(JWT_COOKIE, token, remember);
    dispatch(closeModal());
    return dispatch(requestFinished(action, { id, displayName }));
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
    return dispatch(requestFinished(action, response));
  };
}

export function userSendResetPasswordEmail({ email }) {
  const action = actionTypes.USER_SEND_RESET_PASSWORD_EMAIL;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await getRequest(`/users/resetPassword/${email}`);
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function userResetPassword({ password }, token) {
  const action = actionTypes.USER_RESET_PASSWORD;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await putRequest('/users/resetPassword', {
      token,
      password,
    });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function userChangePassword({ currentPassword, password }, id) {
  const action = actionTypes.USER_CHANGE_PASSWORD;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await putRequest('/users/changePassword', {
      id,
      currentPassword,
      password,
    });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function userSendVerifyEmail() {
  const action = actionTypes.USER_SEND_VERIFY_EMAIL;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await getRequest('/users/verifyEmail');
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function userVerifyEmail(emailToken) {
  const action = actionTypes.USER_VERIFY_EMAIL;
  return async dispatch => {
    dispatch(requestStarted(action));

    const response = await putRequest('/users/verifyEmail', { emailToken });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
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

export function userUpdateProfile(userId, profile) {
  const action = actionTypes.USER_UPDATE_PROFILE;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await putRequest(`/users/${userId}`, { profile });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    const updatedProfile = response.profile;
    dispatch(requestFinished(action));
    return objKeysToCamel(updatedProfile);
  };
}

export function userSetProfilePictureUrl(userId, url) {
  const action = actionTypes.USER_SET_PROFILE_PICTURE_URL;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await putRequest(`/users/picture/${userId}`, { url });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action));
  };
}
