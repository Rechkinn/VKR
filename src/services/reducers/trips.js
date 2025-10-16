import { ACTIVE_TAB } from "../../utils/consts";
import {
  CLOSE_FORM_SECTION_TRIP,
  OPEN_FORM_SECTION_TRIP,
  SET_CURRENT_TAB,
} from "../actions/trips";

const initialState = {
  currentTab: ACTIVE_TAB,
  isOpeningForm: false,
};

export const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_TAB:
      return {
        ...state,
        currentTab: action.currentTab,
      };
    case OPEN_FORM_SECTION_TRIP:
      return {
        ...state,
        isOpeningForm: true,
      };
    case CLOSE_FORM_SECTION_TRIP:
      return {
        ...state,
        isOpeningForm: false,
      };
    default:
      return state;
  }
};
