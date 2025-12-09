import {
  SET_USER_TELEGRAM_INFO,
  USER_TELEGRAM_INFO_REQUEST_ERROR,
  USER_TELEGRAM_INFO_REQUEST,
  USER_TELEGRAM_INFO_REQUEST_SUCCESS,
  SET_USER_DATA_IN_LOCAL_STORAGE,
  SET_USER_ACCESS_TOKEN,
  REMOVE_USER_ACCESS_TOKEN,
  REMOVE_USER_DATA_IN_LOCAL_STORAGE,
  CHANGE_USER_INFO_REQUEST,
  CHANGE_USER_INFO_REQUEST_ERROR,
  CHANGE_USER_INFO_REQUEST_SUCCESS,
} from "../actions/user";

// const initialState = {
//   infoFromTelegram: {
//     allows_write_to_pm: true,
//     created_at: "2025-10-29T11:31:34.834898Z",
//     first_name: "Алексей",
//     id: 3,
//     is_active: true,
//     is_verified: true,
//     language_code: "ru",
//     last_name: "Редькин",
//     phone_number: "89138178218",
//     photo_url:
//       "https://t.me/i/userpic/320/JtGPbJBctx4LLq_nm2R9calFGN2KxnnIKkyKLZQyodE.svg",
//     rating_avg: 4.9,
//     rating_count: 0,
//     role: "driver",
//     sbp_bank: null,
//     sbp_phone_number: null,
//     subscription_exp: "2025-12-08T21:35:30.894573Z",
//     telegram_id: 870593529,
//     updated_at: "2025-11-12T09:13:16.296053Z",
//     username: "Rechkinnnn",
//   },
//   userTelegramInfoRequest: false,
//   userTelegramInfoRequestError: false,

//   changeUserInfoRequest: false,
//   changeUserInfoRequestError: false,
// };

const initialState = {
  infoFromTelegram: {},
  userTelegramInfoRequest: false,
  userTelegramInfoRequestError: false,
  changeUserInfoRequest: false,
  changeUserInfoRequestError: false,
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

    case CHANGE_USER_INFO_REQUEST:
      return {
        ...state,
        changeUserInfoRequest: true,
        changeUserInfoRequestError: false,
      };
    case CHANGE_USER_INFO_REQUEST_ERROR:
      return {
        ...state,
        changeUserInfoRequest: false,
        changeUserInfoRequestError: true,
      };
    case CHANGE_USER_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        changeUserInfoRequest: false,
        changeUserInfoRequestError: false,
      };
    default:
      return state;
  }
};
