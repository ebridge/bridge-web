import { fromJS } from 'immutable';
import { actionTypes } from '../actions/formActions';
import { FORGOT } from '../../constants/reducersConstants';

const initialState = fromJS({
  // Can be [failed, invalid, pending, submitted]
  formStatus: undefined,
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  errors: {},
  // Individual values
  email: '',
  // Validity is typeof undefined when untouched, string with reason or true when set
  emailValidity: undefined,
});

const forgotReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.UPDATE_TEXT}_${FORGOT}`:
    return state.merge({
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
    });
  case `${actionTypes.UPDATE_INPUT_FOCUS}_${FORGOT}`:
    return state.merge({
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
      errors: action.errors,
    });
  case `${actionTypes.UPDATE_FORM_STATUS}_${FORGOT}`:
    return state.merge({
      formStatus: action.status,
      errors: action.errors,
    });

  default:
    return state;
  }
};

export default forgotReducer;
