import { combineReducers } from "redux";
import { navbarReducer } from "./navbar";
import { backgroundReducer } from "./background";
import { userReducer } from "./user";
import { tripsReducer } from "./trips";
import { modalReducer } from "./modal";
import { carReducer } from "./car";
import { referralReducer } from "./referral";

export const rootReducer = combineReducers({
  navbar: navbarReducer,
  background: backgroundReducer,
  user: userReducer,
  trips: tripsReducer,
  modal: modalReducer,
  car: carReducer,
  referral: referralReducer,
});
