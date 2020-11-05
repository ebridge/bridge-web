import {
  WS_GLOBAL_MESSAGES,
  WS_GLOBAL_MESSAGE,
  WS_ROOM_MESSAGES,
  WS_ROOM_MESSAGE,
} from '../../constants/socketEvents';

const initialState = {
  globalChatMessages: [],
  roomChatMessages: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
  case WS_GLOBAL_MESSAGES:
    return {
      ...state,
      globalChatMessages: action.payload,
    };
  case WS_GLOBAL_MESSAGE:
    return {
      ...state,
      globalChatMessages: [...state.globalChatMessages, action.payload],
    };
  case WS_ROOM_MESSAGES:
    return {
      ...state,
      roomChatMessages: action.payload,
    };
  case WS_ROOM_MESSAGE:
    return {
      ...state,
      roomChatMessages: [...state.roomChatMessages, action.payload],
    };
  default:
    return state;

      // TODO: leave room delete roomChatMessages
  }
};

export default chatReducer;
