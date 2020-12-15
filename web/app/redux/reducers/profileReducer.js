import { actionTypes } from '../actions/formActions';
import { PROFILE } from '../../constants/reducersConstants';

const initialState = {
  name: '',
  bio: '',
  birthDate: null,
  birthDateIsPrivate: false,
  conventions: '',
  location: '',
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.SET_STATE_FROM_PROPS}_${PROFILE}`:
    return {
      ...state,
      ...action.value,
    };
  case `${actionTypes.UPDATE_TEXT}_${PROFILE}`:
  case `${actionTypes.UPDATE_DATE}_${PROFILE}`:
  case `${actionTypes.UPDATE_CHECKBOX}_${PROFILE}`:
    return {
      ...state,
      [action.inputType]: action.value,
    };
  default:
    return state;
  }
};

export default profileReducer;
