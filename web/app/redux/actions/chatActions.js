import { getRequest, postRequest } from '../service';
import {
  requestStarted,
  requestFinished,
  requestFailed,
} from './apiActions';

export const actionTypes = {
  CHAT_SUBMIT: 'CHAT_SUBMIT',
  CHAT_JOIN: 'CHAT_JOIN',
};

export function submitChat(chatObject) {
  const action = actionTypes.CHAT_SUBMIT;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await postRequest('/chat', { chatObject });

    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }

    return dispatch(requestFinished(action));
  };
}

export function joinChat() {
  const action = actionTypes.CHAT_JOIN;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await getRequest('/chat');

    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}
