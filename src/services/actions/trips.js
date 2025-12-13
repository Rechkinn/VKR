import { doRequest } from "../../utils/doRequest";

export const SET_CURRENT_TAB = "SET_CURRENT_TAB";

export const GET_TRIPS_REQUEST = "GET_TRIPS_REQUEST";
export const GET_TRIPS_REQUEST_ERROR = "GET_TRIPS_REQUEST_ERROR";
export const GET_TRIPS_REQUEST_SUCCESS = "GET_TRIPS_REQUEST_SUCCESS";

export const ADD_TRIP = "ADD_TRIP";
export const ADD_TRIP_REQUEST = "ADD_TRIP_REQUEST";
export const ADD_TRIP_REQUEST_ERROR = "ADD_TRIP_REQUEST_ERROR";
export const ADD_TRIP_REQUEST_SUCCESS = "ADD_TRIP_REQUEST_SUCCESS";

export const SET_TRIP_FOR_SETTINGS = "SET_TRIP_FOR_SETTINGS";

export const REMOVE_TRIP_REQUEST = "REMOVE_TRIP_REQUEST";
export const REMOVE_TRIP_REQUEST_ERROR = "REMOVE_TRIP_REQUEST_ERROR";
export const REMOVE_TRIP_REQUEST_SUCCESS = "REMOVE_TRIP_REQUEST_SUCCESS";
export const REMOVE_TRIP_REQUEST_RESET = "REMOVE_TRIP_REQUEST_RESET";

export const GET_TRIPS_FOR_CALENDAR_REQUEST = "GET_TRIPS_FOR_CALENDAR_REQUEST";
export const GET_TRIPS_FOR_CALENDAR_REQUEST_ERROR =
  "GET_TRIPS_FOR_CALENDAR_REQUEST_ERROR";
export const GET_TRIPS_FOR_CALENDAR_REQUEST_SUCCESS =
  "GET_TRIPS_FOR_CALENDAR_REQUEST_SUCCESS";

export const ADD_TRIP_OWN = "ADD_TRIP_OWN";
export const ADD_TRIP_OWN_REQUEST = "ADD_TRIP_OWN_REQUEST";
export const ADD_TRIP_OWN_REQUEST_ERROR = "ADD_TRIP_OWN_REQUEST_ERROR";
export const ADD_TRIP_OWN_REQUEST_SUCCESS = "ADD_TRIP_OWN_REQUEST_SUCCESS";

export const UPDATE_TRIP_REQUEST = "UPDATE_TRIP_REQUEST";
export const UPDATE_TRIP_REQUEST_ERROR = "UPDATE_TRIP_REQUEST_ERROR";
export const UPDATE_TRIP_REQUEST_SUCCESS = "UPDATE_TRIP_REQUEST_SUCCESS";
export const UPDATE_TRIP_REQUEST_RESET = "UPDATE_TRIP_REQUEST_RESET";

export const CHANGE_TRIP_TYPE_REQUEST = "CHANGE_TRIP_TYPE_REQUEST";
export const CHANGE_TRIP_TYPE_REQUEST_ERROR = "CHANGE_TRIP_TYPE_REQUEST_ERROR";
export const CHANGE_TRIP_TYPE_REQUEST_SUCCESS =
  "CHANGE_TRIP_TYPE_REQUEST_SUCCESS";

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

    doRequest("/trips/search?role=creator&trip_type=delegated", option)
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

export function addTripDelegated(newTrip, closeForm = () => {}) {
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

export function addTripOwn(newTrip, closeForm = () => {}) {
  return function (dispatch) {
    dispatch({
      type: ADD_TRIP_OWN_REQUEST,
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
          type: ADD_TRIP_OWN,
          newTrip: trip,
        });
        dispatch({
          type: ADD_TRIP_OWN_REQUEST_SUCCESS,
        });
        closeForm();
      })
      .catch(() => {
        dispatch({
          type: ADD_TRIP_OWN_REQUEST_ERROR,
        });
      });
  };
}

export function removeTrip(tripId, closeSettings = () => {}) {
  return function (dispatch) {
    dispatch({
      type: REMOVE_TRIP_REQUEST,
    });

    const option = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };

    doRequest(`/trips/${tripId}`, option)
      .then((data) => {
        dispatch({
          type: REMOVE_TRIP_REQUEST_SUCCESS,
          idTripForRemove: tripId,
        });
        dispatch({
          type: SET_TRIP_FOR_SETTINGS,
          tripForSettings: null,
        });
        closeSettings();
      })
      .catch((error) => {
        dispatch({
          type: REMOVE_TRIP_REQUEST_ERROR,
        });
      });
  };
}

export function getTripsForCalendar() {
  return function (dispatch) {
    dispatch({
      type: GET_TRIPS_FOR_CALENDAR_REQUEST,
    });
    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };

    doRequest("/trips/search?role=all", option)
      .then((trips) => {
        dispatch({
          type: GET_TRIPS_FOR_CALENDAR_REQUEST_SUCCESS,
          trips: trips,
        });
      })
      .catch(
        dispatch({
          type: GET_TRIPS_FOR_CALENDAR_REQUEST_ERROR,
        })
      );
  };
}

export function updateTrip(trip, closeForm = () => {}) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_TRIP_REQUEST,
    });

    const option = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(trip),
    };

    doRequest(`/trips/${trip.id}`, option)
      .then((updatingTrip) => {
        dispatch({
          type: UPDATE_TRIP_REQUEST_SUCCESS,
          updatingTrip: updatingTrip,
        });
        closeForm();
      })
      .catch(() => {
        dispatch({
          type: UPDATE_TRIP_REQUEST_ERROR,
        });
      });
  };
}

export function changeTripType(tripId, closeSettingsTrip = () => {}) {
  return function (dispatch) {
    dispatch({
      type: CHANGE_TRIP_TYPE_REQUEST,
    });

    const option = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        trip_type: "delegated",
        is_delegation_active: true,
        status: "published",
      }),
    };

    doRequest(`/trips/${tripId}`, option)
      .then((updatingTrip) => {
        dispatch({
          type: CHANGE_TRIP_TYPE_REQUEST_SUCCESS,
          updatingTrip: updatingTrip,
        });
        closeSettingsTrip();
      })
      .catch(() => {
        dispatch({
          type: CHANGE_TRIP_TYPE_REQUEST_ERROR,
        });
      });
  };
}
