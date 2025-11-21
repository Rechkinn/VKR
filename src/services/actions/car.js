import { doRequest } from "../../utils/doRequest";

export const CAR_CREATE_REQUEST = "CAR_CREATE_REQUEST";
export const CAR_CREATE_REQUEST_ERROR = "CAR_CREATE_REQUEST_ERROR";
export const CAR_CREATE_REQUEST_SUCCESS = "CAR_CREATE_REQUEST_SUCCESS";

export function createCar(car) {
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
        dispatch({
          type: CAR_CREATE_REQUEST_SUCCESS,
          newCar: newCar,
        });
      })
      .catch(() => {
        dispatch({
          type: CAR_CREATE_REQUEST_ERROR,
        });
      });
  };
}
