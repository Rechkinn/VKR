import { doRequest } from "../../utils/doRequest";

export const SET_USER_TELEGRAM_INFO = "SET_USER_TELEGRAM_INFO";
// export const SET_USER_BACKEND_INFO = "SET_USER_BACKEND_INFO";

export const USER_TELEGRAM_INFO_REQUEST = "USER_TELEGRAM_INFO_REQUEST";
export const USER_TELEGRAM_INFO_REQUEST_ERROR =
  "USER_TELEGRAM_INFO_REQUEST_ERROR";
export const USER_TELEGRAM_INFO_REQUEST_SUCCESS =
  "USER_TELEGRAM_INFO_REQUEST_SUCCESS";

export const SET_USER_ACCESS_TOKEN = "SET_USER_ACCESS_TOKEN";
export const SET_USER_DATA_IN_LOCAL_STORAGE = "SET_USER_DATA_IN_LOCAL_STORAGE";
export const REMOVE_USER_ACCESS_TOKEN = "REMOVE_USER_ACCESS_TOKEN";
export const REMOVE_USER_DATA_IN_LOCAL_STORAGE =
  "REMOVE_USER_DATA_IN_LOCAL_STORAGE";

export function authentication(initData) {
  console.log("защли в функцию аутентификации");
  return function (dispatch) {
    dispatch({
      type: USER_TELEGRAM_INFO_REQUEST,
    });

    console.log("initData в функции authentication");
    console.log(initData);

    const option = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ init_data: initData }),
    };

    doRequest("/auth/telegram", option)
      .then((data) => {
        console.log("data");
        console.log(data);
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: data.user,
        });
        dispatch({
          type: SET_USER_ACCESS_TOKEN,
          access_token: data.access_token,
        });
        dispatch({
          type: SET_USER_DATA_IN_LOCAL_STORAGE,
          dataUser: data.user,
        });
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_SUCCESS,
        });
      })
      .catch(() => {
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_ERROR,
        });
      });
  };
}

export const authenticationWithAccessToken = () => {
  return function (dispatch) {
    dispatch({
      type: USER_TELEGRAM_INFO_REQUEST,
    });

    const option = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };

    doRequest("/auth/me", option)
      .then((data) => {
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: data,
        });
      })
      .catch(() => {
        dispatch({
          type: REMOVE_USER_ACCESS_TOKEN,
        });
        dispatch({
          type: REMOVE_USER_DATA_IN_LOCAL_STORAGE,
        });
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_ERROR,
        });
      });
  };
};
