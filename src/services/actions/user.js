import { doRequest } from "../../utils/doRequest";

export const SET_USER_TELEGRAM_INFO = "SET_USER_TELEGRAM_INFO";
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

export const CHANGE_USER_INFO_REQUEST = "CHANGE_USER_INFO_REQUEST";
export const CHANGE_USER_INFO_REQUEST_ERROR = "CHANGE_USER_INFO_REQUEST_ERROR";
export const CHANGE_USER_INFO_REQUEST_SUCCESS =
  "CHANGE_USER_INFO_REQUEST_SUCCESS";

export function authentication(initData) {
  return function (dispatch) {
    dispatch({
      type: USER_TELEGRAM_INFO_REQUEST,
    });

    const option = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ init_data: initData }),
    };

    doRequest("/auth/telegram", option)
      .then((data) => {
        console.log("аутентификация дефолт успешна");
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
        console.log("аутентификация дефолт неУспешна");
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_ERROR,
        });
      });
  };
}

export const authenticationWithAccessToken = (
  defaultAuthentication = () => {}
) => {
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
        console.log("аутентификация через токен успешна");
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: data,
        });
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_SUCCESS,
        });
      })
      .catch(() => {
        console.log("аутентификация через токен неУспешна");
        dispatch({
          type: REMOVE_USER_ACCESS_TOKEN,
        });
        dispatch({
          type: REMOVE_USER_DATA_IN_LOCAL_STORAGE,
        });
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_ERROR,
        });
        console.log("пробуем повторно аутентифицироваться без токена");
        defaultAuthentication();
      });
  };
};

export function changeUserInfo(newUserInfo, functionToCloseForm = () => {}) {
  return function (dispatch) {
    dispatch({
      type: CHANGE_USER_INFO_REQUEST,
    });

    const option = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(newUserInfo),
    };

    doRequest("/users/me", option)
      .then((user) => {
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: user,
        });
        dispatch({
          type: CHANGE_USER_INFO_REQUEST_SUCCESS,
        });
        console.log(user);
        functionToCloseForm();
      })
      .catch(() => {
        dispatch({
          type: CHANGE_USER_INFO_REQUEST_ERROR,
        });
      });
  };
}
