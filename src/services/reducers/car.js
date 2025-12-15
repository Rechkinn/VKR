import {
  CAR_CREATE_REQUEST,
  CAR_CREATE_REQUEST_ERROR,
  CAR_CREATE_REQUEST_RESET,
  CAR_CREATE_REQUEST_SUCCESS,
  EDIT_CAR_REQUEST,
  EDIT_CAR_REQUEST_ERROR,
  EDIT_CAR_REQUEST_RESET,
  EDIT_CAR_REQUEST_SUCCESS,
  GET_CARS_REQUEST,
  GET_CARS_REQUEST_ERROR,
  GET_CARS_REQUEST_SUCCESS,
  REMOVE_CAR_REQUEST,
  REMOVE_CAR_REQUEST_ERROR,
  REMOVE_CAR_REQUEST_RESET,
  REMOVE_CAR_REQUEST_SUCCESS,
  SET_CAR_FOR_SETTINGS,
} from "../actions/car";

const initialState = {
  // cars: [
  //   {
  //     brand: "Mercedes-Benz",
  //     model: "AMG GTS 500",
  //     year: 0,
  //     color: "string",
  //     license_plate: "А123МР77",
  //     additional_info: "qwe wq eqwe qwe wqe qwe qwe qwe qwee",
  //     car_class: "microbus",
  //     id: 1,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: false,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "QWEWQE WEQWE qwe",
  //     car_class: "microbus",
  //     id: 2,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: false,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "123 123 123 123 12 3123 222",
  //     car_class: "bus",
  //     id: 3,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: true,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "123 123 123 123 12 3123 222",
  //     car_class: "bus",
  //     id: 3,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: true,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "123 123 123 123 12 3123 222",
  //     car_class: "bus",
  //     id: 3,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: true,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "123 123 123 123 12 3123 222",
  //     car_class: "bus",
  //     id: 3,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: true,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "123 123 123 123 12 3123 222",
  //     car_class: "bus",
  //     id: 3,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: true,
  //   },
  // ],
  cars: [],
  createCarRequest: false,
  createCarRequestError: false,

  getCarsRequest: false,
  getCarsRequestError: false,

  carForSettings: null,

  editCarRequest: false,
  editCarRequestError: false,

  removeCarRequest: false,
  removeCarRequestError: false,
};

export const carReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_CAR_REQUEST_RESET:
      return {
        ...state,
        removeCarRequest: false,
        removeCarRequestError: false,
      };
    case REMOVE_CAR_REQUEST:
      return {
        ...state,
        removeCarRequest: true,
        removeCarRequestError: false,
      };
    case REMOVE_CAR_REQUEST_ERROR:
      return {
        ...state,
        removeCarRequest: false,
        removeCarRequestError: true,
      };
    case REMOVE_CAR_REQUEST_SUCCESS:
      return {
        ...state,
        cars: [...state.cars.filter((car) => car.id !== action.removingCarId)],
        removeCarRequest: false,
        removeCarRequestError: false,
      };
    case EDIT_CAR_REQUEST_RESET:
      return {
        ...state,
        editCarRequest: false,
        editCarRequestError: false,
      };
    case EDIT_CAR_REQUEST:
      return {
        ...state,
        editCarRequest: true,
        editCarRequestError: false,
      };
    case EDIT_CAR_REQUEST_ERROR:
      return {
        ...state,
        editCarRequest: false,
        editCarRequestError: true,
      };
    case EDIT_CAR_REQUEST_SUCCESS:
      return {
        ...state,
        cars: [
          ...state.cars.map((car) => {
            return car.id === action.updatingCar.id ? action.updatingCar : car;
          }),
        ],
        editCarRequest: false,
        editCarRequestError: false,
      };
    case SET_CAR_FOR_SETTINGS:
      return {
        ...state,
        carForSettings: action.carForSettings,
      };
    case CAR_CREATE_REQUEST_RESET:
      return {
        ...state,
        createCarRequest: false,
        createCarRequestError: false,
      };
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
        cars: [...state.cars, action.newCar],
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
