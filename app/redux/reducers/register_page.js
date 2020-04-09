import { fromJS } from 'immutable';
import { actionTypes } from '../actions/form_actions';

const initialState = fromJS({
  // Can be [failed, invalid, pending, submitted]
  registrationFormStatus: undefined,
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  errors: {},
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

const registerPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.UPDATE_TEXT:
    return state.merge({
      [action.formType]: action.value,
      [`${action.formType}Validity`]: action.validity,
    });

  case actionTypes.REGISTRATION_FORM_STATUS:
    return state.merge({
      registrationFormStatus: action.status,
      errors: action.errors,
    });

  default:
    return state;
  }
};

export default registerPageReducer;
