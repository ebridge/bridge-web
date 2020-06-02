import { fromJS } from 'immutable';
import { actionTypes as userActionTypes } from '../actions/userActions';
import { actionTypes as apiActionTypes } from '../actions/apiActions';

const initialState = fromJS({
  username: '',
});

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case apiActionTypes.REQUEST_FINISHED:
    switch (action.requestType) {
    case userActionTypes.USER_LOGIN:
      return state.merge({
        username: action.username,
      });
    case userActionTypes.USER_LOGOUT:
      return state.merge({
        username: '',
      });
    case userActionTypes.USER_GET:
      return state.merge({
        username: action.username,
      });
    default:
      return state;
    }
  default:
    return state;
  }
};

export default userReducer;
