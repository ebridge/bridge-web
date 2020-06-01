import { fromJS } from 'immutable';
import { actionTypes } from '../actions/formActions';
import { LOGIN } from '../../constants/reducersConstants';

const initialState = fromJS({
  // List of errors by type. Each type contains an array for if there are multiple error reasons
  formErrors: {},
  // Individual values
  email: '',
  password: '',
  // Validity is typeof undefined when untouched, string with reason or true when set
  emailValidity: undefined,
  passwordValidity: undefined,
});

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.UPDATE_TEXT}_${LOGIN}`:
    return state.merge({
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
    });
  case `${actionTypes.UPDATE_INPUT_FOCUS}_${LOGIN}`:
    return state.merge({
      [action.inputType]: action.value,
      [`${action.inputType}Validity`]: action.validity,
      formErrors: action.formErrors,
    });
  case `${actionTypes.UPDATE_FORM_STATUS}_${LOGIN}`:
    return state.merge({
      formErrors: action.formErrors,
    });

  default:
    return state;
  }
};

export default loginReducer;
