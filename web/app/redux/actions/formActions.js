import {
  // EMAIL,
  // DISPLAY_NAME,
  // PASSWORD,
  // PASSWORD_REPEAT,
  ALL_FORM_TYPES,
  FORM_INVALID,
  FORM_PENDING,
  FORM_SUBMITTED,
  // FORM_FAILED,
} from '../../constants/formConstants';
import { validateField } from '../../lib/validationUtils';
import logger from '../../lib/logger';

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

export function blurInput(inputType, value, existingErrors, REDUCER_NAME) {
  if (!ALL_FORM_TYPES.includes(inputType)) {
    logger.warn(`Invalid form type: ${inputType} passed to blurInput.`);
    return null;
  }

  const errors = {
    ...existingErrors,
    [inputType]: validateField(inputType, value),
  };
  const validity = validateField(inputType, value);

  return {
    type: `${actionTypes.UPDATE_INPUT_FOCUS}_${REDUCER_NAME}`,
    inputType,
    value,
    validity,
    errors,
  };
}

export function submitForm(inputFields, REDUCER_NAME) {
  return async (dispatch) => {
    const errors = {};
    Object.entries(inputFields).forEach((keyValue) => {
      const [inputType, inputValue] = keyValue;
      const fieldValidity = validateField(inputType, inputValue);
      if (fieldValidity !== true) {
        errors[inputType] = fieldValidity;
      }
    });

    if (Object.keys(errors).length) {
      return dispatch({
        type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
        status: FORM_INVALID,
        errors,
      });
    }

    dispatch({
      type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
      status: FORM_PENDING,
    });

    // TODO: service file and logic
    // placeholder
    // const service = {
    //   postRequest: () => new Promise((resolve) => (
    //     setTimeout(() => resolve({
    //       status: 201,
    //       data: {
    //         // email,
    //         // displayName,
    //       },
    //     }), 3000)
    //   )),
    // };
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

    // const failedDispatch = {
    //   type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
    //   status: FORM_FAILED,
    //   errors: {
    //     general: ['Unable to register at this time. Please try again'],
    //   },
    // };

    // TODO: Submit form to backend
    // let response;
    // try {
    //   response = await service.postRequest('/v1/register', {
    //     email,
    //     displayName,
    //     password,
    //     passwordRepeat,
    //   });
    // } catch (err) {
    //   dispatch(failedDispatch);
    //   logger.error(`Error posting to /v1/register :${err}`);
    // }

    // on successful response
    // if (response.status === 201) {
    //   return dispatch({
    //     type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
    //     status: FORM_SUBMITTED,
    //   });
    // }

    const testSuccess = {
      type: `${actionTypes.UPDATE_FORM_STATUS}_${REDUCER_NAME}`,
      status: FORM_SUBMITTED,
    };

    return dispatch(testSuccess);
  };
}

export const mapDispatchToProps = (dispatch, REDUCER_NAME) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, REDUCER_NAME)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, REDUCER_NAME)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, REDUCER_NAME)
  ),
});
