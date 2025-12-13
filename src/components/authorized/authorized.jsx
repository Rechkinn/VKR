import { useState, useEffect } from "react";
import App from "../app/app";
import { useDispatch, useSelector } from "react-redux";
import {
  authentication,
  authenticationWithAccessToken,
  SET_USER_TELEGRAM_INFO,
  USER_TELEGRAM_INFO_REQUEST_ERROR,
} from "../../services/actions/user";
import Loader from "../loader/loader";
import { getCars } from "../../services/actions/car";
import { getTrips, getTripsForCalendar } from "../../services/actions/trips";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const dispatch = useDispatch();

  const {
    infoFromTelegram,
    userTelegramInfoRequest,
    userTelegramInfoRequestError,
  } = useSelector((store) => store.user);

  const [customLog, setCustomLog] = useState("");

  // Вспомогательная функция парсинга initData (оставляем выше эффектов для удобства)
  const parseInitData = (initDataString) => {
    if (!initDataString) return null;
    try {
      const params = new URLSearchParams(initDataString);
      const result = {};
      for (const [key, value] of params) {
        if (key === "user") {
          try {
            result[key] = JSON.parse(decodeURIComponent(value));
          } catch {
            result[key] = value;
          }
        } else {
          result[key] = value;
        }
      }

      return result;
    } catch (err) {
      dispatch({
        type: USER_TELEGRAM_INFO_REQUEST_ERROR,
      });

      return { raw: initDataString };
    }
  };

  // Инициализация Telegram WebApp (делаем один раз)
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      try {
        const webApp = window.Telegram?.WebApp;
        webApp.ready();

        if (webApp.disableVerticalSwipes) webApp.disableVerticalSwipes();
        if (webApp.expand) webApp.expand();
        if (webApp.requestFullscreen) webApp.requestFullscreen();

        setWebApp(webApp);
      } catch (e) {
        console.log(e);
        setCustomLog(e.message);
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_ERROR,
        });
      }
    } else {
      dispatch({
        type: USER_TELEGRAM_INFO_REQUEST_ERROR,
      });
    }
  }, []);

  useEffect(() => {
    if (!webApp) return;

    const unsafe = webApp.initDataUnsafe;
    const initData = webApp.initData;

    if (unsafe?.user) {
      dispatch({ type: SET_USER_TELEGRAM_INFO, infoFromTelegram: unsafe.user });
    } else {
      const parsed = parseInitData(initData);
      if (parsed?.user) {
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: parsed.user,
        });
      }
    }

    if (initData && initData.trim() !== "") {
      if (localStorage.getItem("access_token")) {
        dispatch(
          authenticationWithAccessToken(() => defaultAuthentication(initData))
        );
      } else {
        defaultAuthentication(initData);
      }
    }
    dispatch(getCars());
    dispatch(getTrips());
    dispatch(getTripsForCalendar());
  }, [webApp, dispatch]);

  function defaultAuthentication(initData) {
    dispatch(authentication(initData));
  }

  return (
    <>
      {userTelegramInfoRequest && <Loader>Аутентификация...</Loader>}

      {!userTelegramInfoRequest && userTelegramInfoRequestError && (
        <>
          <p style={{ color: "red" }}>Ошибка аутентификации!</p>
          <div style={{ color: "red" }}>подробности: {customLog}</div>
        </>
      )}

      {!userTelegramInfoRequest &&
        !userTelegramInfoRequestError &&
        infoFromTelegram?.telegram_id && <App />}
      {/* {!userTelegramInfoRequest &&
        !userTelegramInfoRequestError &&
        infoFromTelegram?.telegram_id && (
          <div style={{ color: "red" }}>Логи: {customLog}</div>
        )} */}

      {!userTelegramInfoRequest &&
        !userTelegramInfoRequestError &&
        !infoFromTelegram?.telegram_id && (
          <>
            <div style={{ color: "#666", marginTop: 12 }}>
              Откройте мини-приложение внутри Telegram (в мобильной версии/на
              десктопе). Если вы в браузере — убедитесь, что приложение запущено
              через кнопку открытия приложения.
            </div>
            <div style={{ color: "red", marginTop: 12 }}>
              infoFromTelegram: {JSON.stringify(infoFromTelegram)}
            </div>
          </>
        )}
    </>
  );
};

export default TelegramAuth;
