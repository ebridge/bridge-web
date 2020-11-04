import { actionTypes } from '../actions/modalActions';

const initialState = {
  modalType: null,
  modalProps: {},
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
  default:
    return state;
  }
};

export default modalsReducer;
