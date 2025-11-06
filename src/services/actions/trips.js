export const SET_CURRENT_TAB = "SET_CURRENT_TAB";
export const GET_TRIPS_REQUEST = "GET_TRIPS_REQUEST";
export const GET_TRIPS_REQUEST_ERROR = "GET_TRIPS_REQUEST_ERROR";
export const GET_TRIPS_REQUEST_SUCCESS = "GET_TRIPS_REQUEST_SUCCESS";

export function getTrips() {
  return function (dispatch) {
    dispatch({
      type: GET_TRIPS_REQUEST,
    });

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(newData),
    };
  };
}
