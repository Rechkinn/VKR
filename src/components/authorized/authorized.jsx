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

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const dispatch = useDispatch();

  const {
    infoFromTelegram,
    userTelegramInfoRequest,
    userTelegramInfoRequestError,
  } = useSelector((store) => store.user);

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
      // const tgWebApp = window.Telegram.WebApp;
      // setWebApp(tgWebApp);

      try {
        window.Telegram.WebApp.ready();
        console.log("прошло window.Telegram.WebApp.ready();");
        window.Telegram.WebApp.expand();
        console.log("прошло window.Telegram.WebApp.expand();");
        window.Telegram.WebApp.isVerticalSwipesEnabled = false;
        console.log(
          "прошло window.Telegram.WebApp.isVerticalSwipesEnabled = false;"
        );
        // expand может не сработать в некоторых контекстах, но попытка безопасна
        // if (typeof tgWebApp.expand === "function") tgWebApp.expand();
      } catch (e) {
        // console.warn("Telegram WebApp initialization warning:", e);
        dispatch({
          type: USER_TELEGRAM_INFO_REQUEST_ERROR,
        });
      }
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
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
  }, [webApp, dispatch]);

  function defaultAuthentication(initData) {
    dispatch(authentication(initData));
  }

  return (
    <>
      {userTelegramInfoRequest && <Loader>Аутентификация...</Loader>}

      {!userTelegramInfoRequest && userTelegramInfoRequestError && (
        <p style={{ color: "red" }}>Ошибка аутентификации!</p>
      )}

      {!userTelegramInfoRequest &&
        !userTelegramInfoRequestError &&
        infoFromTelegram?.telegram_id && <App />}

      {!userTelegramInfoRequest &&
        !userTelegramInfoRequestError &&
        !infoFromTelegram?.telegram_id && (
          <div style={{ color: "#666", marginTop: 12 }}>
            Откройте мини-приложение внутри Telegram (в мобильной версии/на
            десктопе). Если вы в браузере — убедитесь, что приложение запущено
            через кнопку открытия приложения.
          </div>
        )}
    </>
  );
};

export default TelegramAuth;
