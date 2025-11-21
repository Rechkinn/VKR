import {
  CAR_CREATE_REQUEST,
  CAR_CREATE_REQUEST_ERROR,
  CAR_CREATE_REQUEST_SUCCESS,
  GET_CARS_REQUEST,
  GET_CARS_REQUEST_ERROR,
  GET_CARS_REQUEST_SUCCESS,
} from "../actions/car";

const initialState = {
  cars: [],
  createCarRequest: false,
  createCarRequestError: false,

  getCarsRequest: false,
  getCarsRequestError: false,
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
    case GET_CARS_REQUEST:
      return {
        ...state,
        getCarsRequest: true,
        getCarsRequestError: false,
      };
    case GET_CARS_REQUEST_ERROR:
      return {
        ...state,
        getCarsRequest: false,
        getCarsRequestError: true,
      };
    case GET_CARS_REQUEST_SUCCESS:
      return {
        ...state,
        cars: [...action.cars],
        getCarsRequest: false,
        getCarsRequestError: false,
      };
    default:
      return state;
  }
};
