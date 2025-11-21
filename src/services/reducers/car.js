import {
  CAR_CREATE_REQUEST,
  CAR_CREATE_REQUEST_ERROR,
  CAR_CREATE_REQUEST_SUCCESS,
} from "../actions/car";

const initialState = {
  cars: [],
  createCarRequest: false,
  createCarRequestError: false,
};

export const carReducer = (state = initialState, action) => {
  switch (action.type) {
    case CAR_CREATE_REQUEST:
      return {
        ...state,
        createCarRequest: true,
        createCarRequestError: false,
      };
    case CAR_CREATE_REQUEST_ERROR:
      return {
        ...state,
        createCarRequest: false,
        createCarRequestError: true,
      };
    case CAR_CREATE_REQUEST_SUCCESS:
      return {
        ...state,
        cars: [...cars, action.newCar],
        createCarRequest: false,
        createCarRequestError: false,
      };
    default:
      return state;
  }
};
