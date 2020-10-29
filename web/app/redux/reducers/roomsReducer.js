import { fromJS } from 'immutable';
import { Router } from 'next/router';
import { actionTypes as roomActionTypes } from '../actions/roomsActions';
import { actionTypes as apiActionTypes } from '../actions/apiActions';

const initialState = fromJS({
  rooms: [],
  room: {},
  roomId: '',
});

const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
  case apiActionTypes.REQUEST_FINISHED:
    switch (action.requestType) {
    case roomActionTypes.ROOMS_GET_ALL_ROOMS:
      return state.merge({
        rooms: action?.data?.rooms,
      });
    case roomActionTypes.ROOMS_GET_ONE_ROOM:
      return state.merge({
        room: action?.data?.room,
      });
    case roomActionTypes.ROOMS_JOIN_ROOM:
      Router.push(`/room/${action?.data?.roomId}`);
      return state.merge({
        roomId: action?.data?.roomId,
      });
    case roomActionTypes.ROOMS_LEAVE_ROOM:
      Router.push('/dashboard');
      return state;
    default:
      return state;
    }
  default:
    return state;
  }
};

export default roomsReducer;
