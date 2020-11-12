import { actionTypes } from '../actions/formActions';
import { RESET_PASSWORD } from '../../constants/reducersConstants';

const initialState = {
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  formErrors: {},
  // Individual values
  password: '',
  passwordRepeat: '',
  // Validity is typeof undefined when untouched, array of reasons or true when set
  passwordValidity: undefined,
  passwordRepeatValidity: undefined,
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.UPDATE_TEXT}_${RESET_PASSWORD}`:
    return {
      ...state,
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
    };
  case `${actionTypes.UPDATE_INPUT_FOCUS}_${RESET_PASSWORD}`:
    return {
      ...state,
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
      formErrors: action.formErrors,
    };
  case `${actionTypes.UPDATE_FORM_STATUS}_${RESET_PASSWORD}`:
    return {
      ...state,
      formErrors: action.formErrors,
    };
  default:
    return state;
  }
};

export default registerReducer;
