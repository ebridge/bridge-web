import { ALL_MODAL_TYPES } from '../../constants/modalConstants';
import logger from '../../lib/logger';

export const actionTypes = {
  MODAL_OPEN: 'MODAL_OPEN',
  MODAL_CLOSE: 'MODAL_CLOSE',
};

export function openModal(modalType, modalProps) {
  if (!ALL_MODAL_TYPES.includes(modalType)) {
    logger.warn(`Invalid modal type: ${modalType} passed to openModal.`);
    return null;
  }
  return {
    type: actionTypes.MODAL_OPEN,
    modalType,
    modalProps,
  }
}

export function closeModal(modalType, modalProps) {
  return {
    type: actionTypes.MODAL_CLOSE,
    modalType,
    modalProps,
  }
};
