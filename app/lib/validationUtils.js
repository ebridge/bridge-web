// import validator from 'validator';
import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
  ALL_FORM_TYPES,
} from '../constants/forms';
import logger from './logger';

/* Return true if valid, array of ui-display-friendly reasons why not if not */
export function validateField(field, value) {
  if (!ALL_FORM_TYPES.includes(field)) {
    logger.warn(`Invalid field type: ${field} passed to validateField.`);
    return null;
  }

  // Reasons are UI errors
  const reasons = [];

  // TODO: Individual element validation
  switch (field) {
  case EMAIL:
    if (!value) {
      reasons.push('Email cannot be empty.');
      return reasons;
    }
    return true;
  case DISPLAY_NAME:
    if (!value) {
      reasons.push('Display Name cannot be empty.');
      return reasons;
    }
    return true;
  case PASSWORD:
    if (!value) {
      reasons.push('Password cannot be empty.');
      return reasons;
    }
    return true;
  case PASSWORD_REPEAT:
    if (!value) {
      reasons.push('Password repeat must be empty.');
      return reasons;
    }
    return true;
  default:
    logger.warn(`No validation exists for field: ${field}.`);
    return reasons;
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
