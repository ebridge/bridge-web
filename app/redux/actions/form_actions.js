import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
  ALL_FORM_TYPES,
  FORM_INVALID,
  FORM_PENDING,
  FORM_SUBMITTED,
  FORM_FAILED,
} from '../../constants/forms';
import { validateField } from '../../lib/validationUtils';
import logger from '../../lib/logger';

// Action types
export const actionTypes = {
  UPDATE_TEXT: 'UPDATE_TEXT',
  REGISTRATION_FORM_STATUS: 'REGISTRATION_FORM_STATUS',
};

export function updateText(formType, value) {
  if (!ALL_FORM_TYPES.includes(formType)) {
    logger.warn(`Invalid form type: ${formType} passed to updateText.`);
    return null;
  }

  // Validate form type. Returns true if valid or array of reasons why not
  const validity = validateField(formType, value);

  return {
    type: actionTypes.UPDATE_TEXT,
    formType,
    value,
    validity,
  };
}

export function submitRegistrationForm() {
  return async (dispatch, getState) => {
    const registerPage = getState().get('registerPage');
    const email = registerPage.get('email');
    const displayName = registerPage.get('displayName');
    const password = registerPage.get('password');
    const passwordRepeat = registerPage.get('passwordRepeat');

    const errors = {};
    const emailInvalid = validateField(EMAIL, email);
    if (emailInvalid !== true) {
      errors.email = emailInvalid;
    }

    const displayNameInvalid = validateField(DISPLAY_NAME, displayName);
    if (displayNameInvalid !== true) {
      errors.displayName = displayNameInvalid;
    }

    const passwordInvalid = validateField(PASSWORD, password);
    if (passwordInvalid !== true) {
      errors.password = passwordInvalid;
    }

    const passwordRepeatInvalid = validateField(PASSWORD_REPEAT, passwordRepeat);
    if (passwordRepeatInvalid !== true) {
      errors.passwordRepeat = passwordRepeatInvalid;
    }

    // .general errors are errors displayed at bottom of form
    if (password !== passwordRepeat) {
      errors.general = ['Passwords do not match.'];
    }

    if (Object.keys(errors).length) {
      return dispatch({
        type: actionTypes.REGISTRATION_FORM_STATUS,
        status: FORM_INVALID,
        errors,
      });
    }

    dispatch({
      type: actionTypes.REGISTRATION_FORM_STATUS,
      status: FORM_PENDING,
    });

    // TODO: service file and logic
    // placeholder
    const service = {
      postRequest: () => new Promise((resolve) => (
        setTimeout(() => resolve({
          status: 201,
          data: {
            email,
            displayName,
          },
        }), 3000)
      )),
    };
    // Uncomment to test error
    // const service = {
    //   postRequest: () => new Promise((resolve, reject) => (
    //     setTimeout(reject({
    //       status: 403,
    //       data: {
    //         email,
    //         displayName,
    //       },
    //     }), 3000)
    //   )),
    // };

    const failedDispatch = {
      type: actionTypes.REGISTRATION_FORM_STATUS,
      status: FORM_FAILED,
      errors: {
        general: ['Unable to register at this time. Please try again'],
      },
    };

    // TODO: Submit form to backend
    let response;
    try {
      response = await service.postRequest('/v1/register', {
        email,
        displayName,
        password,
        passwordRepeat,
      });
    } catch (err) {
      dispatch(failedDispatch);
      logger.error(`Error posting to /v1/register :${err}`);
    }

    // on successful response
    if (response.status === 201) {
      return dispatch({
        type: actionTypes.REGISTRATION_FORM_STATUS,
        status: FORM_SUBMITTED,
      });
    }

    return dispatch(failedDispatch);
  };
}
