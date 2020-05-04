import validator from 'validator';
import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
  ALL_FORM_TYPES,
} from '../constants/formConstants';
import logger from './logger';

/* Return true if valid, array of ui-display-friendly reason why not if not */
export function validateField(field, value) {
  if (!ALL_FORM_TYPES.includes(field)) {
    logger.warn(`Invalid field type: ${field} passed to validateField.`);
    return null;
  }

  // reason are UI errors
  let reason = '';

  // TODO: Individual element validation
  switch (field) {
  case EMAIL:
    if (!value || !validator.isEmail(value)) {
      reason = 'Enter a valid email address';
      return reason;
    }
    return true;
  case DISPLAY_NAME:
    if (!value || !validator.isLength(value, { min: 3, max: 20 })) {
      reason = 'Display name must be between 3 and 20 characters';
      return reason;
    }
    return true;
  case PASSWORD:
    if (!value) {
      reason = 'Password cannot be empty';
      return reason;
    }
    return true;
  case PASSWORD_REPEAT:
    if (!value) {
      reason = 'Password repeat cannot be empty';
      return reason;
    }
    return true;
  default:
    logger.warn(`No validation exists for field: ${field}.`);
    return reason;
  }
}

export const placeholder = '';


// handleChange(e) {
//   const input = e.target.value;
//   let validInput = false;
//   switch (this.props.name) {
//   case 'email':
//     if (validator.isEmail(input)) {
//       validInput = true;
//       break;
//     }
//     break;
//   case 'display':
//     if (validator.isLength(input, { min: 3, max: 20 })) {
//       validInput = true;
//       break;
//     }
//     break;
//   case 'password':
//     if (validator.isLength(input, { min: 5, max: 10 })) {
//       validInput = true;
//       break;
//     }
//     break;
//   case 'password repeat':
//     break;
//   default:
//     validInput = false;
//     break;
//   }

//   if (validInput) {
//     this.setState({
//       value: input,
//       valid: true,
//     });
//   } else {
//     this.setState({
//       value: input,
//       valid: false,
//     });
//   }
// }
