import { doRequest } from "../../utils/doRequest";

export const SET_CURRENT_TAB = "SET_CURRENT_TAB";

export const GET_TRIPS_REQUEST = "GET_TRIPS_REQUEST";
export const GET_TRIPS_REQUEST_ERROR = "GET_TRIPS_REQUEST_ERROR";
export const GET_TRIPS_REQUEST_SUCCESS = "GET_TRIPS_REQUEST_SUCCESS";

export const ADD_TRIP = "ADD_TRIP";
export const ADD_TRIP_REQUEST = "ADD_TRIP_REQUEST";
export const ADD_TRIP_REQUEST_ERROR = "ADD_TRIP_REQUEST_ERROR";
export const ADD_TRIP_REQUEST_SUCCESS = "ADD_TRIP_REQUEST_SUCCESS";

export function getTrips() {
  return function (dispatch) {
    dispatch({
      type: GET_TRIPS_REQUEST,
    });

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };

    doRequest("/trips/search?trip_type=delegated&skip=0&limit=50", option)
      .then((trips) => {
        dispatch({
          type: GET_TRIPS_REQUEST_SUCCESS,
          trips: trips,
        });
      })
      .catch(
        dispatch({
          type: GET_TRIPS_REQUEST_ERROR,
        })
      );
  };
}

export function addTrip(newTrip, closeForm = () => {}) {
  return function (dispatch) {
    dispatch({
      type: ADD_TRIP_REQUEST,
    });

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(newTrip),
    };

    doRequest("/trips", option)
      .then((trip) => {
        dispatch({
          type: ADD_TRIP,
          newTrip: trip,
        });
        dispatch({
          type: ADD_TRIP_REQUEST_SUCCESS,
        });
        closeForm();
      })
      .catch(() => {
        dispatch({
          type: ADD_TRIP_REQUEST_ERROR,
        });
      });
  };
}
