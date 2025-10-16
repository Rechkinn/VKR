import { combineReducers } from "redux";
import { navbarReducer } from "./navbar";
import { profileReducer } from "./profile";
import { backgroundReducer } from "./background";
import { userReducer } from "./user";
import { tripsReducer } from "./trips";
import { modalReducer } from "./modal";

export const rootReducer = combineReducers({
  navbar: navbarReducer,
  profile: profileReducer,
  background: backgroundReducer,
  user: userReducer,
  trips: tripsReducer,
  modal: modalReducer,
});
