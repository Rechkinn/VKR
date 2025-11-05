import {
  SET_ACTIVE_SECTION_NAVBAR,
  SET_VISIBILITY_NAVBAR,
} from "../actions/navbar";

const initialState = {
  // activeSection: "CALENDAR",
  // activeSection: "TRIPS",
  activeSection: "PROFILE",
  visibility: true,
};

export const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_SECTION_NAVBAR:
      return {
        ...state,
        activeSection: action.activeSection,
      };
    case SET_VISIBILITY_NAVBAR:
      return {
        ...state,
        visibility: action.visibility,
      };
    default:
      return state;
  }
};
