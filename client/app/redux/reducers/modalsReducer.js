import { fromJS } from 'immutable'
import { actionTypes } from '../actions/modalActions';

const initialState = fromJS({
  modalType: null,
  modalProps: {},
})

const modalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MODAL_OPEN:
      return state.merge({
        modalType: action.modalType,
        modalProps: action.modalProps,
      });
    case actionTypes.MODAL_CLOSE:
      return initialState;
    default:
      return state;
  }
};

export default modalsReducer;
