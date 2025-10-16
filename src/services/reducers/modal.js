import { SET_VISIBILITY_MODAL } from "../actions/modal";

const initialState = {
  visibilityModal: false,
};

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISIBILITY_MODAL:
      return {
        ...state,
        visibilityModal: action.visibilityModal,
      };
    default:
      return state;
  }
};
