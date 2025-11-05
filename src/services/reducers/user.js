import {
  SET_USER_TELEGRAM_INFO,
  SET_USER_BACKEND_INFO,
  USER_TELEGRAM_INFO_REQUEST_ERROR,
  USER_TELEGRAM_INFO_REQUEST,
  USER_TELEGRAM_INFO_REQUEST_SUCCESS,
  SET_USER_DATA_IN_LOCAL_STORAGE,
  SET_USER_ACCESS_TOKEN,
} from "../actions/user";

// const initialState = {
//   infoFromTelegram: {
//     id: 870593529,
//     first_name: "Aleks",
//     last_name: "",
//     username: "Rechkinnnn",
//     language_code: "ru",
//     allows_write_to_pm: true,
//     photo_url:
//       "https://t.me/i/userpic/320/JtGPbJBctx4LLq_nm2R9calFGN2KxnnIKkyKLZQyodE.svg",
//   },
//   infoFromBackend: null,
// };

const initialState = {
  infoFromTelegram: {},
  infoFromBackend: {},
  userTelegramInfoRequest: false,
  userTelegramInfoRequestError: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TELEGRAM_INFO:
      return {
        ...state,
        infoFromTelegram: {
          ...Object.assign(state.infoFromTelegram, action.infoFromTelegram),
        },
      };
    case SET_USER_BACKEND_INFO:
      return {
        ...state,
        infoFromBackend: {
          ...Object.assign(state.infoFromBackend, action.infoFromBackend),
        },
      };
    case USER_TELEGRAM_INFO_REQUEST:
      return {
        ...state,
        userTelegramInfoRequest: true,
        userTelegramInfoRequestError: false,
      };
    case USER_TELEGRAM_INFO_REQUEST_ERROR:
      return {
        ...state,
        userTelegramInfoRequest: false,
        userTelegramInfoRequestError: true,
      };
    case USER_TELEGRAM_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        userTelegramInfoRequest: false,
        userTelegramInfoRequestError: false,
      };
    case SET_USER_ACCESS_TOKEN:
      localStorage.setItem("access_token", action.access_token);
      return state;
    case SET_USER_DATA_IN_LOCAL_STORAGE:
      localStorage.setItem("user", JSON.stringify(action.dataUser));
      return state;

    default:
      return state;
  }
};
