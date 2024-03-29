import { actionTypes } from '../actions/formActions';
import { actionTypes as modalActionTypes } from '../actions/modalActions';
import { FORGOT_PASSWORD } from '../../constants/reducersConstants';

const initialState = {
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  formErrors: {},
  // Individual values
  email: '',
  // Validity is typeof undefined when untouched, string with reason or true when set
  emailValidity: undefined,
};

const forgotPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${modalActionTypes.MODAL_CLOSE}`:
    return initialState;
  case `${actionTypes.UPDATE_TEXT}_${FORGOT_PASSWORD}`:
    return {
      ...state,
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
    };
  case `${actionTypes.UPDATE_INPUT_FOCUS}_${FORGOT_PASSWORD}`:
    return {
      ...state,
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
      formErrors: action.formErrors,
    };
  case `${actionTypes.UPDATE_FORM_STATUS}_${FORGOT_PASSWORD}`:
    return {
      ...state,
      formErrors: action.formErrors,
    };

  default:
    return state;
  }
};

export default forgotPasswordReducer;
