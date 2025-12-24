import { ACTIVE_TAB } from "../../utils/consts";
import { isDevelopmentMode } from "../../utils/development-mode";
import {
  ADD_TRIP,
  ADD_TRIP_OWN,
  ADD_TRIP_OWN_REQUEST,
  ADD_TRIP_OWN_REQUEST_ERROR,
  ADD_TRIP_OWN_REQUEST_SUCCESS,
  ADD_TRIP_REQUEST,
  ADD_TRIP_REQUEST_ERROR,
  ADD_TRIP_REQUEST_SUCCESS,
  GET_TRIPS_FOR_CALENDAR_REQUEST,
  GET_TRIPS_FOR_CALENDAR_REQUEST_ERROR,
  GET_TRIPS_FOR_CALENDAR_REQUEST_SUCCESS,
  GET_TRIPS_REQUEST,
  GET_TRIPS_REQUEST_ERROR,
  GET_TRIPS_REQUEST_SUCCESS,
  REMOVE_TRIP_REQUEST,
  REMOVE_TRIP_REQUEST_ERROR,
  REMOVE_TRIP_REQUEST_SUCCESS,
  REMOVE_TRIP_REQUEST_RESET,
  SET_CURRENT_TAB,
  SET_TRIP_FOR_SETTINGS,
  UPDATE_TRIP_REQUEST,
  UPDATE_TRIP_REQUEST_ERROR,
  UPDATE_TRIP_REQUEST_SUCCESS,
  UPDATE_TRIP_REQUEST_RESET,
  CHANGE_TRIP_TYPE_REQUEST_ERROR,
  CHANGE_TRIP_TYPE_REQUEST,
  CHANGE_TRIP_TYPE_REQUEST_SUCCESS,
  REMOVE_TRIP_OWN_REQUEST,
  REMOVE_TRIP_OWN_REQUEST_ERROR,
  REMOVE_TRIP_OWN_REQUEST_SUCCESS,
  REMOVE_TRIP_OWN_REQUEST_RESET,
} from "../actions/trips";

const initialState = {
  currentTab: ACTIVE_TAB,
  trips: isDevelopmentMode
    ? [
        {
          id: 65,
          creator_id: 4,
          driver_id: 1,
          vehicle_id: 1,
          from_address: "Томск",
          to_address: "Шерегеш",
          passenger_phone_number: "777",
          departure_datetime: "2025-12-25T12:00:00.007000Z",
          price: 666,
          total_seats: 5,
          car_class: "passenger_car",
          description: "очень хотим туда",
          trip_type: "delegated",
          status: "confirmed",
          delegation_commission: 300,
          is_delegation_active: false,
          created_at: "2025-11-05T10:17:48.952964Z",
          driver: {
            username: "dinozavrik_22",
            first_name: "Захар",
            last_name: "Гаськов",
            phone_number: "+7 (951) 167-76-11",
            id: 1,
            telegram_id: 695088267,
            role: "driver",
            is_active: true,
            is_verified: true,
            subscription_exp: "2027-05-30T19:32:38.560974Z",
            sbp_bank: "Сбербанк",
            sbp_phone_number: null,
            rating_avg: 4.8,
            rating_count: 0,
            created_at: "2025-10-27T13:10:27.456742Z",
            updated_at: "2025-12-13T18:51:18.327361Z",
          },
          creator: {
            username: "shestikpetr",
            first_name: "Пётр",
            last_name: "Шестопалов",
            phone_number: "+79025492626",
            id: 4,
            telegram_id: 385620077,
            role: "driver",
            is_active: true,
            is_verified: true,
            subscription_exp: null,
            sbp_bank: "Т-Банк",
            sbp_phone_number: null,
            rating_avg: 0,
            rating_count: 0,
            created_at: "2025-11-01T19:09:30.662708Z",
            updated_at: "2025-11-01T19:09:51.066818Z",
          },
          vehicle: {
            brand: "Scoda",
            model: "Rapid",
            year: 2021,
            color: "красный",
            license_plate: "B498EE70",
            additional_info: "Есть утюг и 4 кг навоза",
            car_class: "passenger_car",
            id: 1,
            driver_id: 1,
            photo_url: null,
            is_active: false,
          },
        },
      ]
    : null,
  // trips: null,
  getTripsRequest: false,
  getTripsRequestError: false,

  addTripRequest: false,
  addTripRequestError: false,

  tripForSettings: null,

  removeTripRequest: false,
  removeTripRequestError: false,

  removeTripOwnRequest: false,
  removeTripOwnRequestError: false,

  tripsForCalendar: isDevelopmentMode
    ? [
        {
          id: 65,
          creator_id: 4,
          driver_id: 1,
          vehicle_id: 1,
          from_address: "Томск",
          to_address: "Шерегеш",
          passenger_phone_number: "777",
          departure_datetime: "2025-12-27T12:00:00.007000Z",
          price: 666,
          total_seats: 5,
          car_class: "passenger_car",
          description: "очень хотим туда",
          trip_type: "own",
          status: "confirmed",
          delegation_commission: 300,
          is_delegation_active: false,
          created_at: "2025-11-05T10:17:48.952964Z",
          driver: {
            username: "dinozavrik_22",
            first_name: "Захар",
            last_name: "Гаськов",
            phone_number: "+7 (951) 167-76-11",
            id: 1,
            telegram_id: 695088267,
            role: "driver",
            is_active: true,
            is_verified: true,
            subscription_exp: "2027-05-30T19:32:38.560974Z",
            sbp_bank: "Сбербанк",
            sbp_phone_number: null,
            rating_avg: 4.8,
            rating_count: 0,
            created_at: "2025-10-27T13:10:27.456742Z",
            updated_at: "2025-12-13T18:51:18.327361Z",
          },
          creator: {
            username: "shestikpetr",
            first_name: "Пётр",
            last_name: "Шестопалов",
            phone_number: "+79025492626",
            id: 4,
            telegram_id: 385620077,
            role: "driver",
            is_active: true,
            is_verified: true,
            subscription_exp: null,
            sbp_bank: "Т-Банк",
            sbp_phone_number: null,
            rating_avg: 0,
            rating_count: 0,
            created_at: "2025-11-01T19:09:30.662708Z",
            updated_at: "2025-11-01T19:09:51.066818Z",
          },
          vehicle: {
            brand: "Scoda",
            model: "Rapid",
            year: 2021,
            color: "красный",
            license_plate: "B498EE70",
            additional_info: "Есть утюг и 4 кг навоза",
            car_class: "passenger_car",
            id: 1,
            driver_id: 1,
            photo_url: null,
            is_active: false,
          },
        },
        {
          id: 65,
          creator_id: 4,
          driver_id: 1,
          vehicle_id: 1,
          from_address: "Томск",
          to_address: "Шерегеш",
          passenger_phone_number: "777",
          departure_datetime: "2025-12-26T12:00:00.007000Z",
          price: 666,
          total_seats: 5,
          car_class: "passenger_car",
          description: "очень хотим туда",
          trip_type: "delegated",
          status: "confirmed",
          delegation_commission: 300,
          is_delegation_active: false,
          created_at: "2025-11-05T10:17:48.952964Z",
          driver: {
            username: "dinozavrik_22",
            first_name: "Захар",
            last_name: "Гаськов",
            phone_number: "+7 (951) 167-76-11",
            id: 1,
            telegram_id: 695088267,
            role: "driver",
            is_active: true,
            is_verified: true,
            subscription_exp: "2027-05-30T19:32:38.560974Z",
            sbp_bank: "Сбербанк",
            sbp_phone_number: null,
            rating_avg: 4.8,
            rating_count: 0,
            created_at: "2025-10-27T13:10:27.456742Z",
            updated_at: "2025-12-13T18:51:18.327361Z",
          },
          creator: {
            username: "shestikpetr",
            first_name: "Пётр",
            last_name: "Шестопалов",
            phone_number: "+79025492626",
            id: 4,
            telegram_id: 385620077,
            role: "driver",
            is_active: true,
            is_verified: true,
            subscription_exp: null,
            sbp_bank: "Т-Банк",
            sbp_phone_number: null,
            rating_avg: 0,
            rating_count: 0,
            created_at: "2025-11-01T19:09:30.662708Z",
            updated_at: "2025-11-01T19:09:51.066818Z",
          },
          vehicle: {
            brand: "Scoda",
            model: "Rapid",
            year: 2021,
            color: "красный",
            license_plate: "B498EE70",
            additional_info: "Есть утюг и 4 кг навоза",
            car_class: "passenger_car",
            id: 1,
            driver_id: 1,
            photo_url: null,
            is_active: false,
          },
        },
      ]
    : null,
  // tripsForCalendar: null,
  getTripsForCalendarRequest: false,
  getTripsForCalendarRequestError: false,

  addTripOwnRequest: false,
  addTripOwnRequestError: false,

  updateTripRequest: false,
  updateTripRequestError: false,

  changeTripTypeRequest: false,
  changeTripTypeRequestError: false,
};

export const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_TRIP_TYPE_REQUEST:
      return {
        ...state,
        changeTripTypeRequest: true,
        changeTripTypeRequestError: false,
      };
    case CHANGE_TRIP_TYPE_REQUEST_ERROR:
      return {
        ...state,
        changeTripTypeRequest: false,
        changeTripTypeRequestError: true,
      };
    case CHANGE_TRIP_TYPE_REQUEST_SUCCESS:
      return {
        ...state,
        tripsForCalendar: [
          ...state.tripsForCalendar.filter(
            (trip) => trip.id !== action.updatingTrip.id
          ),
        ],
        trips: [...state.trips, action.updatingTrip],
        changeTripTypeRequest: false,
        changeTripTypeRequestError: false,
      };
    case UPDATE_TRIP_REQUEST:
      return {
        ...state,
        updateTripRequest: true,
        updateTripRequestError: false,
      };
    case UPDATE_TRIP_REQUEST_ERROR:
      return {
        ...state,
        updateTripRequest: false,
        updateTripRequestError: true,
      };
    case UPDATE_TRIP_REQUEST_SUCCESS:
      return {
        ...state,
        updateTripRequest: false,
        updateTripRequestError: false,
        tripsForCalendar: [
          ...state.tripsForCalendar.filter((trip) => {
            if (trip.id === action.updatingTrip.id) return action.updatingTrip;
            else return trip;
          }),
        ],
      };
    case UPDATE_TRIP_REQUEST_RESET:
      return {
        ...state,
        updateTripRequest: false,
        updateTripRequestError: false,
      };

    case ADD_TRIP_OWN_REQUEST:
      return {
        ...state,
        addTripOwnRequest: true,
        addTripOwnRequestError: false,
      };
    case ADD_TRIP_OWN_REQUEST_ERROR:
      return {
        ...state,
        addTripOwnRequest: false,
        addTripOwnRequestError: true,
      };
    case ADD_TRIP_OWN_REQUEST_SUCCESS:
      return {
        ...state,
        addTripOwnRequest: false,
        addTripOwnRequestError: false,
      };
    case ADD_TRIP_OWN:
      return {
        ...state,
        tripsForCalendar: [...state.tripsForCalendar, action.newTrip],
      };

    case GET_TRIPS_FOR_CALENDAR_REQUEST:
      return {
        ...state,
        getTripsForCalendarRequest: true,
        getTripsForCalendarRequestError: false,
      };
    case GET_TRIPS_FOR_CALENDAR_REQUEST_ERROR:
      return {
        ...state,
        getTripsForCalendarRequest: false,
        getTripsForCalendarRequestError: true,
      };
    case GET_TRIPS_FOR_CALENDAR_REQUEST_SUCCESS:
      return {
        ...state,
        tripsForCalendar: action.trips,
        getTripsForCalendarRequest: false,
        getTripsForCalendarRequestError: false,
      };
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
    case REMOVE_TRIP_REQUEST_RESET:
      return {
        ...state,
        removeTripRequest: false,
        removeTripRequestError: false,
      };
    case REMOVE_TRIP_OWN_REQUEST:
      return {
        ...state,
        removeTripOwnRequest: true,
        removeTripOwnRequestError: false,
      };

    case REMOVE_TRIP_OWN_REQUEST_ERROR:
      return {
        ...state,
        removeTripOwnRequest: false,
        removeTripOwnRequestError: true,
      };

    case REMOVE_TRIP_OWN_REQUEST_SUCCESS:
      return {
        ...state,
        tripsForCalendar: [
          ...state.tripsForCalendar.filter(
            (trip) => trip.id !== action.idTripForRemove
          ),
        ],
        removeTripOwnRequest: false,
        removeTripOwnRequestError: false,
      };
    case REMOVE_TRIP_OWN_REQUEST_RESET:
      return {
        ...state,
        removeTripOwnRequest: false,
        removeTripOwnRequestError: false,
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
        trips: action.trips,
        getTripsRequest: false,
        getTripsRequestError: false,
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
