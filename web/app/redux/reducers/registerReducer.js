import { fromJS } from 'immutable';
import { actionTypes } from '../actions/formActions';
import { REGISTER } from '../../constants/reducersConstants';

const initialState = fromJS({
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  formErrors: {},
  // Individual values
  email: '',
  displayName: '',
  password: '',
  passwordRepeat: '',
  // Validity is typeof undefined when untouched, array of reasons or true when set
  emailValidity: undefined,
  displayNameValidity: undefined,
  passwordValidity: undefined,
  passwordRepeatValidity: undefined,
});

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.UPDATE_TEXT}_${REGISTER}`:
    return state.merge({
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
    });
  case `${actionTypes.UPDATE_INPUT_FOCUS}_${REGISTER}`:
    return state.merge({
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
      formErrors: action.formErrors,
    });
  case `${actionTypes.UPDATE_FORM_STATUS}_${REGISTER}`:
    return state.merge({
      formErrors: action.formErrors,
    });

  default:
    return state;
  }
};

export default registerReducer;
