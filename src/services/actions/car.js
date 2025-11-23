import { doRequest } from "../../utils/doRequest";

export const CAR_CREATE_REQUEST = "CAR_CREATE_REQUEST";
export const CAR_CREATE_REQUEST_ERROR = "CAR_CREATE_REQUEST_ERROR";
export const CAR_CREATE_REQUEST_SUCCESS = "CAR_CREATE_REQUEST_SUCCESS";

export const GET_CARS_REQUEST = "GET_CARS_REQUEST";
export const GET_CARS_REQUEST_ERROR = "GET_CARS_REQUEST_ERROR";
export const GET_CARS_REQUEST_SUCCESS = "GET_CARS_REQUEST_SUCCESS";

export const SET_CAR_FOR_SETTINGS = "SET_CAR_FOR_SETTINGS";

export const EDIT_CAR_REQUEST = "EDIT_CAR_REQUEST";
export const EDIT_CAR_REQUEST_ERROR = "EDIT_CAR_REQUEST_ERROR";
export const EDIT_CAR_REQUEST_SUCCESS = "EDIT_CAR_REQUEST_SUCCESS";

export function getCars() {
  return function (dispatch) {
    dispatch({
      type: GET_CARS_REQUEST,
    });

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };

    doRequest("/vehicles", option)
      .then((cars) => {
        dispatch({
          type: GET_CARS_REQUEST_SUCCESS,
          cars: cars,
        });
      })
      .catch(() => {
        dispatch({
          type: GET_CARS_REQUEST_ERROR,
        });
      });
  };
}

export function createCar(car, closeCarForm = () => {}) {
  return function (dispatch) {
    dispatch({
      type: CAR_CREATE_REQUEST,
    });

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(car),
    };

    doRequest("/vehicles", option)
      .then((newCar) => {
        console.log("newCar с сервера пришло");
        console.log(newCar);
        dispatch({
          type: CAR_CREATE_REQUEST_SUCCESS,
          newCar: newCar,
        });
        closeCarForm();
      })
      .catch(() => {
        dispatch({
          type: CAR_CREATE_REQUEST_ERROR,
        });
      });
  };
}

export function editCar(carId, car, closeCarForm = () => {}) {
  return function (dispatch) {
    dispatch({
      type: EDIT_CAR_REQUEST,
    });

    const option = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(car),
    };

    doRequest(`/vehicles/${carId}`, option)
      .then((updatingCar) => {
        console.log("updatingCar с сервера пришло");
        console.log(updatingCar);
        dispatch({
          type: EDIT_CAR_REQUEST_SUCCESS,
          updatingCar: updatingCar,
        });
        closeCarForm();
      })
      .catch(() => {
        dispatch({
          type: EDIT_CAR_REQUEST_ERROR,
        });
      });
  };
}
