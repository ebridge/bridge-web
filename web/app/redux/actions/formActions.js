import {
  ALL_FORM_TYPES,
  FORM_INVALID,
} from '../../constants/formConstants';
import {
  validateNonRegisterField,
  validateRegisterField,
} from '../../lib/validationUtils';
import logger from '../../lib/logger';
import {
  userLogin,
  userRegister,
  userResetPassword,
  userSendResetPasswordEmail,
} from './userActions';
import {
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../../constants/reducersConstants';

// Action types
export const actionTypes = {
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_CHECKBOX: 'UPDATE_CHECKBOX',
  UPDATE_INPUT_FOCUS: 'UPDATE_INPUT_FOCUS',
  UPDATE_FORM_STATUS: 'UPDATE_FORM_STATUS',
};

export function updateText(inputType, value, REDUCER_NAME) {
  let validateField = validateNonRegisterField;
  if (REDUCER_NAME === REGISTER || REDUCER_NAME === RESET_PASSWORD) {
    validateField = validateRegisterField;
  }
  return (dispatch, getState) => {
    if (!ALL_FORM_TYPES.includes(inputType)) {
      logger.warn(`Invalid form type: ${inputType} passed to updateText.`);
      return null;
    }

    const registerReducer = getState()[REGISTER];
    const { password } = registerReducer;

    // Validate form type. Returns true if valid or string with reason why invalid
    const validity = validateField(inputType, value, password);

    return dispatch({
      type: `${actionTypes.UPDATE_TEXT}_${REDUCER_NAME}`,
      inputType,
      value,
      validity,
    });
  };
}

export function updateCheckbox(inputType, value, REDUCER_NAME) {
  const validity = validateNonRegisterField(inputType, value);
  return dispatch => dispatch({
    type: `${actionTypes.UPDATE_CHECKBOX}_${REDUCER_NAME}`,
    inputType,
    value,
    validity,
  });
}

export function blurInput(inputType, value, existingFormErrors, REDUCER_NAME) {
  let validateField = validateNonRegisterField;
  if (REDUCER_NAME === REGISTER || REDUCER_NAME === RESET_PASSWORD) {
    validateField = validateRegisterField;
  }
  return (dispatch, getState) => {
    if (!ALL_FORM_TYPES.includes(inputType)) {
      logger.warn(`Invalid form type: ${inputType} passed to blurInput.`);
      return null;
    }

    const registerReducer = getState()[REGISTER];
    const { password } = registerReducer;

    const formErrors = {
      ...existingFormErrors,
      [inputType]: validateField(inputType, value, password),
    };
    const validity = validateField(inputType, value, password);

    return dispatch({
      type: `${actionTypes.UPDATE_INPUT_FOCUS}_${REDUCER_NAME}`,
      inputType,
      value,
      validity,
      formErrors,
    });
  };
}

export function submitForm(inputFields, REDUCER_NAME, token = null) {
  let validateField = validateNonRegisterField;
  if (REDUCER_NAME === REGISTER || REDUCER_NAME === RESET_PASSWORD) {
    validateField = validateRegisterField;
  }
  return async (dispatch, getState) => {
    const formErrors = {};
    const registerReducer = getState()[REGISTER];
    const { password } = registerReducer;
    Object.entries(inputFields).forEach((keyValue) => {
      const [inputType, inputValue] = keyValue;
      const fieldValidity = validateField(inputType, inputValue, password);
      if (fieldValidity !== true) {
        formErrors[inputType] = fieldValidity;
      }
    });

    if (Object.keys(formErrors).length) {
      return dispatch({
        type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
        status: FORM_INVALID,
        formErrors,
      });
    }

    switch (REDUCER_NAME) {
    case REGISTER:
      return dispatch(userRegister(inputFields));
    case LOGIN:
      return dispatch(userLogin(inputFields));
    case FORGOT_PASSWORD:
      return dispatch(userSendResetPasswordEmail(inputFields));
    case RESET_PASSWORD:
      return dispatch(userResetPassword(inputFields, token));
    default:
      return logger.warn('Invalid reducer name passed to submitForm');
    }
  };
}

export const mapDispatchToProps = (dispatch, REDUCER_NAME) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, REDUCER_NAME)
  ),
  dispatchBlurInput: (inputType, value, formErrors) => dispatch(
    blurInput(inputType, value, formErrors, REDUCER_NAME)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, REDUCER_NAME)
  ),
});
