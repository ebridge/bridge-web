const { PROFILE } = require('../../constants/reducersConstants');
const { actionTypes } = require('../actions/modalActions');

const initialState = {
  name: '',
  bio: '',
  conventions: '',
  location: '',
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
  case `${actionTypes.UPDATE_TEXT}_${PROFILE}`:
    return {
      ...state,
      [action.inputType]: action.value,
    };
  default:
    return state;
  }
};

export default profileReducer;
