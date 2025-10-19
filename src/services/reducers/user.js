import { SET_USER_TELEGRAM_INFO, SET_USER_BACKEND_INFO } from "../actions/user";

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
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TELEGRAM_INFO:
      return {
        ...state,
        infoFromTelegram: Object.assign(
          state.infoFromTelegram,
          action.infoFromTelegram
        ),
      };
    case SET_USER_BACKEND_INFO:
      return {
        ...state,
        infoFromBackend: Object.assign(
          state.infoFromBackend,
          action.infoFromBackend
        ),
      };
    default:
      return state;
  }
};
