import { actionTypes } from '../actions/modalActions';

const initialState = {
  modalType: null,
  modalProps: {},
  successfulRegister: false,
};

const modalsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.MODAL_OPEN:
    return {
      ...state,
      modalType: action.modalType,
      modalProps: action.modalProps,
    };
  case actionTypes.MODAL_CLOSE:
    return initialState;
  case actionTypes.MODAL_SWITCH_TO_MAIL:
    return {
      ...state,
      successfulRegister: true,
    };
  default:
    return state;
  }
};

export default modalsReducer;
