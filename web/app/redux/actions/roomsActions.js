import {
  getRequest,
  putRequest,
} from '../service';
import {
  requestStarted,
  requestFinished,
  requestFailed,
} from './apiActions';

export const actionTypes = {
  ROOMS_GET_ALL_ROOMS: 'ROOMS_GET_ALL_ROOMS',
  ROOMS_GET_ONE_ROOM: 'ROOMS_GET_ONE_ROOM',
  ROOMS_JOIN_ROOM: 'ROOMS_JOIN_ROOM',
  ROOMS_LEAVE_ROOM: 'ROOMS_LEAVE_ROOM',
};

export function getAllRooms() {
  const action = actionTypes.ROOMS_GET_ALL_ROOMS;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await getRequest('/rooms');
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function getOneRoom(id) {
  const action = actionTypes.ROOMS_GET_ONE_ROOM;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await getRequest(`/rooms/${id}`);
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function joinRoom(roomId, seat) {
  const action = actionTypes.ROOMS_JOIN_ROOM;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await putRequest('/rooms/join', {
      roomId,
      seat,
    });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}

export function leaveRoom(roomId) {
  const action = actionTypes.ROOMS_LEAVE_ROOM;
  return async dispatch => {
    dispatch(requestStarted(action));
    const response = await putRequest('/rooms/leave', { roomId });
    if (response.error) {
      return dispatch(requestFailed(action, response.error));
    }
    return dispatch(requestFinished(action, response));
  };
}
