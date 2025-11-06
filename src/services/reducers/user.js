import {
  SET_USER_TELEGRAM_INFO,
  USER_TELEGRAM_INFO_REQUEST_ERROR,
  USER_TELEGRAM_INFO_REQUEST,
  USER_TELEGRAM_INFO_REQUEST_SUCCESS,
  SET_USER_DATA_IN_LOCAL_STORAGE,
  SET_USER_ACCESS_TOKEN,
  REMOVE_USER_ACCESS_TOKEN,
  REMOVE_USER_DATA_IN_LOCAL_STORAGE,
} from "../actions/user";

// const initialState = {
//   infoFromTelegram: {
//     allows_write_to_pm: true,
//     balance: 1000000.56,
//     created_at: "2025-10-29T11:31:34.834898Z",
//     first_name: "Крутой Челикс ",
//     id: 3,
//     is_active: true,
//     is_verified: true,
//     language_code: "ru",
//     last_name: "ЛАдно",
//     phone_number: "899999999",
//     photo_url:
//       "https://t.me/i/userpic/320/JtGPbJBctx4LLq_nm2R9calFGN2KxnnIKkyKLZQyodE.svg",
//     rating_avg: 4.9,
//     rating_count: 0,
//     role: "driver",
//     telegram_id: 870593529,
//     updated_at: "2025-11-05T18:27:24.082736Z",
//     username: "Rechkinnnn",
//   },
//   userTelegramInfoRequest: false,
//   userTelegramInfoRequestError: false,
// };

const initialState = {
  infoFromTelegram: {},
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
    case REMOVE_USER_ACCESS_TOKEN:
      localStorage.removeItem("access_token");
      return state;
    case REMOVE_USER_DATA_IN_LOCAL_STORAGE:
      localStorage.removeItem("user");
      return state;
    default:
      return state;
  }
};
