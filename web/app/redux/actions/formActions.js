import {
  // EMAIL,
  // DISPLAY_NAME,
  // PASSWORD,
  // PASSWORD_REPEAT,
  ALL_FORM_TYPES,
  FORM_INVALID,
} from '../../constants/formConstants';
import { validateField } from '../../lib/validationUtils';
import logger from '../../lib/logger';
import {
  userLogin,
  userRegister,
  userForgotPassword,
} from './userActions';
import {
  REGISTER,
  LOGIN,
  FORGOT,
} from '../../constants/reducersConstants';

// Action types
export const actionTypes = {
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_INPUT_FOCUS: 'UPDATE_INPUT_FOCUS',
  UPDATE_FORM_STATUS: 'UPDATE_FORM_STATUS',
};

export function updateText(inputType, value, REDUCER_NAME) {
  if (!ALL_FORM_TYPES.includes(inputType)) {
    logger.warn(`Invalid form type: ${inputType} passed to updateText.`);
    return null;
  }

  // Validate form type. Returns true if valid or string with reason why invalid
  const validity = validateField(inputType, value);

  return {
    type: `${actionTypes.UPDATE_TEXT}_${REDUCER_NAME}`,
    inputType,
    value,
    validity,
  };
}

export function blurInput(inputType, value, existingFormErrors, REDUCER_NAME) {
  if (!ALL_FORM_TYPES.includes(inputType)) {
    logger.warn(`Invalid form type: ${inputType} passed to blurInput.`);
    return null;
  }

  const formErrors = {
    ...existingFormErrors,
    [inputType]: validateField(inputType, value),
  };
  const validity = validateField(inputType, value);

  return {
    type: `${actionTypes.UPDATE_INPUT_FOCUS}_${REDUCER_NAME}`,
    inputType,
    value,
    validity,
    formErrors,
  };
}

export function submitForm(inputFields, REDUCER_NAME) {
  return async (dispatch) => {
    const formErrors = {};
    Object.entries(inputFields).forEach((keyValue) => {
      const [inputType, inputValue] = keyValue;
      const fieldValidity = validateField(inputType, inputValue);
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
    case FORGOT:
      return dispatch(userForgotPassword(inputFields));
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
