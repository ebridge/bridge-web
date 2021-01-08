import { actionTypes } from '../actions/formActions';
import { CHANGE_PASSWORD } from '../../constants/reducersConstants';

const initialState = {
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  formErrors: {},
  // Individual values
  currentPassword: '',
  password: '',
  passwordRepeat: '',
  // Validity is typeof undefined when untouched, array of reasons or true when set
  currentPasswordValidity: undefined,
  passwordValidity: undefined,
  passwordRepeatValidity: undefined,
};

const changePasswordReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.UPDATE_TEXT}_${CHANGE_PASSWORD}`:
    return {
      ...state,
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
    };
  case `${actionTypes.UPDATE_INPUT_FOCUS}_${CHANGE_PASSWORD}`:
    return {
      ...state,
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
      formErrors: action.formErrors,
    };
  case `${actionTypes.UPDATE_FORM_STATUS}_${CHANGE_PASSWORD}`:
    return {
      ...state,
      formErrors: action.formErrors,
    };
  default:
    return state;
  }
};

export default changePasswordReducer;
