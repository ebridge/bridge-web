import {
  ALL_FORM_TYPES,
  FORM_INVALID,
  FORM_PENDING,
} from '../../constants/formConstants';
import {
  validateNonRegisterField,
  validateRegisterField,
} from '../../lib/validationUtils';
import logger from '../../lib/logger';
import {
  userChangePassword,
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
  PROFILE,
  PASSWORD_REDUCERS,
  CHANGE_PASSWORD,
} from '../../constants/reducersConstants';

// Action types
export const actionTypes = {
  SET_STATE_FROM_PROPS: 'SET_STATE_FROM_PROPS',
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_CHECKBOX: 'UPDATE_CHECKBOX',
  UPDATE_DATE: 'UPDATE_DATE',
  UPDATE_INPUT_FOCUS: 'UPDATE_INPUT_FOCUS',
  UPDATE_FORM_STATUS: 'UPDATE_FORM_STATUS',
};

export function setStateFromProps(props, REDUCER_NAME) {
  return dispatch => dispatch({
    type: `${actionTypes.SET_STATE_FROM_PROPS}_${REDUCER_NAME}`,
    value: props,
  });
}

function getPassword(getState, reducer) {
  return getState(reducer).password;
}

export function updateText(inputType, value, REDUCER_NAME) {
  let validateField = validateNonRegisterField;
  if (PASSWORD_REDUCERS.includes(REDUCER_NAME)) {
    validateField = validateRegisterField;
  }
  return (dispatch, getState) => {
    if (!ALL_FORM_TYPES.includes(inputType)) {
      logger.warn(`Invalid form type: ${inputType} passed to updateText.`);
      return null;
    }

    if (REDUCER_NAME === PROFILE) {
      return dispatch({
        type: `${actionTypes.UPDATE_TEXT}_${PROFILE}`,
        inputType,
        value,
      });
    }

    const password = getPassword(getState, REDUCER_NAME);

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
  let validity = true;
  if (REDUCER_NAME !== PROFILE) {
    validity = validateNonRegisterField(inputType, value);
  }
  return dispatch => dispatch({
    type: `${actionTypes.UPDATE_CHECKBOX}_${REDUCER_NAME}`,
    inputType,
    value,
    validity,
  });
}

export function updateDate(inputType, date, REDUCER_NAME) {
  return dispatch => dispatch({
    type: `${actionTypes.UPDATE_DATE}_${REDUCER_NAME}`,
    inputType,
    value: date,
  });
}

export function blurInput(inputType, value, existingFormErrors, REDUCER_NAME) {
  let validateField = validateNonRegisterField;
  if (PASSWORD_REDUCERS.includes(REDUCER_NAME)) {
    validateField = validateRegisterField;
  }
  return (dispatch, getState) => {
    if (!ALL_FORM_TYPES.includes(inputType)) {
      logger.warn(`Invalid form type: ${inputType} passed to blurInput.`);
      return null;
    }

    let { password } = getState()[REGISTER];
    if (REDUCER_NAME === RESET_PASSWORD) {
      password = getState()[RESET_PASSWORD].password;
    }

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

export function submitForm(inputFields, REDUCER_NAME, tokenOrId = null) {
  let validateField = validateNonRegisterField;
  if (PASSWORD_REDUCERS.includes(REDUCER_NAME)) {
    validateField = validateRegisterField;
  }
  return async (dispatch, getState) => {
    const formErrors = {};
    let password;
    if (PASSWORD_REDUCERS.includes(REDUCER_NAME)) {
      password = getState()[REDUCER_NAME].password;
    }
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

    dispatch({
      type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
      statys: FORM_PENDING,
      formErrors,
    });

    switch (REDUCER_NAME) {
    case REGISTER:
      return dispatch(userRegister(inputFields));
    case LOGIN:
      return dispatch(userLogin(inputFields));
    case FORGOT_PASSWORD:
      return dispatch(userSendResetPasswordEmail(inputFields));
    case RESET_PASSWORD:
      return dispatch(userResetPassword(inputFields, tokenOrId));
    case CHANGE_PASSWORD:
      return dispatch(userChangePassword(inputFields, tokenOrId));
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
