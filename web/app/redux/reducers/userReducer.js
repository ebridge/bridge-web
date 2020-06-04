import Router from 'next/router';
import { fromJS } from 'immutable';
import { actionTypes as userActionTypes } from '../actions/userActions';
import { actionTypes as apiActionTypes } from '../actions/apiActions';

const initialState = fromJS({
  displayName: '',
});

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case apiActionTypes.REQUEST_FINISHED:
    switch (action.requestType) {
    case userActionTypes.USER_LOGIN:
      state.merge({
        displayName: action?.data?.displayName,
      });
      return Router.push('/dashboard');
    case userActionTypes.USER_LOGOUT:
      state.merge({
        displayName: '',
      });
      return Router.push('/');
    case userActionTypes.USER_AUTHENTICATE:
      return state.merge({
        displayName: action?.data?.displayName,
      });
    default:
      return state;
    }
  default:
    return state;
  }
};

export default userReducer;
