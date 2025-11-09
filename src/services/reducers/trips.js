import { ACTIVE_TAB } from "../../utils/consts";
import {
  ADD_TRIP,
  ADD_TRIP_REQUEST,
  ADD_TRIP_REQUEST_ERROR,
  ADD_TRIP_REQUEST_SUCCESS,
  GET_TRIPS_REQUEST,
  GET_TRIPS_REQUEST_ERROR,
  GET_TRIPS_REQUEST_SUCCESS,
  REMOVE_TRIP_REQUEST,
  REMOVE_TRIP_REQUEST_ERROR,
  REMOVE_TRIP_REQUEST_SUCCESS,
  SET_CURRENT_TAB,
  SET_TRIP_FOR_SETTINGS,
} from "../actions/trips";

const initialState = {
  currentTab: ACTIVE_TAB,
  trips: null,
  getTripsRequest: false,
  getTripsRequestError: false,

  addTripRequest: false,
  addTripRequestError: false,

  tripForSettings: null,

  removeTripRequest: false,
  removeTripRequestError: false,
};

export const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_TRIP_REQUEST:
      return {
        ...state,
        removeTripRequest: true,
        removeTripRequestError: false,
      };

    case REMOVE_TRIP_REQUEST_ERROR:
      return {
        ...state,
        removeTripRequest: false,
        removeTripRequestError: true,
      };

    case REMOVE_TRIP_REQUEST_SUCCESS:
      return {
        ...state,
        trips: [
          ...state.trips.filter((trip) => {
            if (trip.id !== action.idTripForRemove) {
              return trip;
            }
          }),
        ],
        removeTripRequest: false,
        removeTripRequestError: false,
      };

    case SET_TRIP_FOR_SETTINGS:
      return {
        ...state,
        tripForSettings: action.tripForSettings,
      };

    case SET_CURRENT_TAB:
      return {
        ...state,
        currentTab: action.currentTab,
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
        getTripsRequest: false,
        getTripsRequestError: false,
        trips: action.trips,
      };

    case ADD_TRIP:
      return {
        ...state,
        trips: [...state.trips, action.newTrip],
      };
    case ADD_TRIP_REQUEST:
      return {
        ...state,
        addTripRequest: true,
        addTripRequestError: false,
      };
    case ADD_TRIP_REQUEST_ERROR:
      return {
        ...state,
        addTripRequest: false,
        addTripRequestError: true,
      };
    case ADD_TRIP_REQUEST_SUCCESS:
      return {
        ...state,
        addTripRequest: false,
        addTripRequestError: false,
      };

    default:
      return state;
  }
};
