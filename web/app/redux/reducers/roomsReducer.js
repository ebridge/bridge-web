import Router from 'next/router';
import { actionTypes as roomActionTypes } from '../actions/roomsActions';
import { actionTypes as apiActionTypes } from '../actions/apiActions';

const initialState = {
  rooms: [],
  room: {},
};

const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
  case apiActionTypes.REQUEST_FINISHED:
    switch (action.requestType) {
    case roomActionTypes.ROOMS_GET_ALL_ROOMS:
      return {
        ...state,
        rooms: action?.data,
      };
    case roomActionTypes.ROOMS_GET_ONE_ROOM:
      return {
        ...state,
        room: action?.data?.room,
      };
    case roomActionTypes.ROOMS_JOIN_ROOM:
      // TODO: redirect to room
      // Router.push(`/room/${action?.data?.roomRegion}/${action?.data?.roomNumber}`);
      Router.reload();
      return {
        ...state,
        roomId: action?.data?.roomId,
      };
    case roomActionTypes.ROOMS_LEAVE_ROOM:
      // TODO: uncomment dashboard push once rooms are set up
      // Router.push('/dashboard');
      Router.reload();
      return state;
    default:
      return state;
    }
  default:
    return state;
  }
};

export default roomsReducer;
