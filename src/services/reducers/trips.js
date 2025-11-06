import { ACTIVE_TAB } from "../../utils/consts";
import {
  ADD_TRIP,
  GET_TRIPS_REQUEST,
  GET_TRIPS_REQUEST_ERROR,
  GET_TRIPS_REQUEST_SUCCESS,
  SET_CURRENT_TAB,
} from "../actions/trips";

const initialState = {
  currentTab: ACTIVE_TAB,
  trips: null,
  getTripsRequest: false,
  getTripsRequestError: false,
};

export const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_TAB:
      return {
        ...state,
        currentTab: action.currentTab,
      };
    case ADD_TRIP:
      return {
        ...state,
        trips: [...state.trips, action.newTrip],
      };
    case GET_TRIPS_REQUEST:
      return {
        ...state,
        getTripsRequest: true,
        getTripsRequestError: false,
      };
    case GET_TRIPS_REQUEST_ERROR:
      return {
        ...state,
        getTripsRequest: false,
        getTripsRequestError: true,
      };
    case GET_TRIPS_REQUEST_SUCCESS:
      return {
        ...state,
        trips: action.trips,
        getTripsRequest: false,
        getTripsRequestError: false,
      };
    default:
      return state;
  }
};
