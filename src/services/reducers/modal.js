import { SET_VISIBILITY_MODAL } from "../actions/modal";

const initialState = {
  visibilityModal: false,
  currentTrip: null,
};

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISIBILITY_MODAL:
      return {
        ...state,
        visibilityModal: action.visibilityModal,
        currentTrip: action.currentTrip,
      };
    default:
      return state;
  }
};
