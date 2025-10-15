import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../actions/background";

const initialState = {
  sunVisibility: true,
};

export const backgroundReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUN_VISIBILITY_ON_BACKGROUND:
      return {
        ...state,
        sunVisibility: action.sunVisibility,
      };
    default:
      return state;
  }
};
