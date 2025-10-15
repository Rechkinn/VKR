import { SET_ACTIVE_SECTION_PROFILE } from "../actions/profile";

const initialState = {
  activeSection: "info",
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_SECTION_PROFILE:
      return {
        ...state,
        activeSection: action.activeSection,
      };
    default:
      return state;
  }
};
