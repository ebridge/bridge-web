import validator from 'validator';
import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
  ALL_FORM_TYPES,
} from '../constants/formConstants';
import logger from './logger';

// Return true if valid, if not, return string containing ui-display-friendly reason
// validateRegisterField is only called on registration form
export function validateRegisterField(field, value, value2) {
  if (!ALL_FORM_TYPES.includes(field)) {
    logger.warn(`Invalid field type: ${field} passed to validateRegisterField.`);
    return null;
  }

  switch (field) {
  case EMAIL:
    if (!value || !validator.isEmail(value)) {
      return 'Enter a valid email address.';
    }
    return true;
  case DISPLAY_NAME:
    if (!value) {
      return 'Enter a display name.';
    }
    if (!validator.isLength(value, { min: 3, max: 20 })) {
      return 'Display name must be 3-20 characters in length.';
    }
    return true;
  case PASSWORD:
    if (!value) {
      return 'Enter a password.';
    }
    if (!validator.isLength(value, { min: 8, max: 100 })) {
      return 'Password must be at least 8 characters in length.';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least 1 lowercase letter.';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least 1 uppercase letter.';
    }
    if (!/\d/.test(value)) {
      return 'Password must contain at least 1 number.';
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(value)) {
      return 'Password must contain at least 1 special character.';
    }
    return true;
  case PASSWORD_REPEAT:
    if (!value) {
      return 'Enter your password again.';
    }
    if (value !== value2) {
      return 'Passwords must match.';
    }
    return true;
  default:
    return logger.warn(`No validation exists for field: ${field} in validateRegisterField.`);
  }
}

export function validateNonRegisterField(field, value) {
  if (!ALL_FORM_TYPES.includes(field)) {
    logger.warn(`Invalid field type: ${field} passed to validateNonRegisterField.`);
    return null;
  }
  switch (field) {
  case EMAIL:
    if (!value || !validator.isEmail(value)) {
      return 'Enter a valid email address.';
    }
    return true;
  case PASSWORD:
    if (!value) {
      return 'Enter a password.';
    }
    return true;
  default:
    return logger.warn(`No validation exists for field: ${field} in validateNonRegisterField.`);
  }
}
