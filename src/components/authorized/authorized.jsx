import { useState, useEffect } from "react";
import App from "../app/app";
import { useDispatch, useSelector } from "react-redux";
import {
  authentication,
  authenticationWithAccessToken,
  SET_USER_TELEGRAM_INFO,
  USER_TELEGRAM_INFO_REQUEST_ERROR,
} from "../../services/actions/user";

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
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);

      try {
        tgWebApp.ready();
        // expand может не сработать в некоторых контекстах, но попытка безопасна
        if (typeof tgWebApp.expand === "function") tgWebApp.expand();
      } catch (e) {
        console.warn("Telegram WebApp initialization warning:", e);
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

  // Универсальная функция аутентификации (без утечек)
  // const authenticateWithTelegram = async (initData) => {
  //   if (!initData) {
  //     throw new Error("No init data available");
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await fetch(
  //       "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ init_data: initData }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const detail = parsedBody?.detail || parsedBody?.message || null;
  //       throw new Error(detail || `Authentication failed: ${response.status}`);
  //     }

  //     console.log("response");
  //     console.log(response);

  //     const data = await response.json();
  //     console.log(data);

  //     localStorage.setItem("access_token", data.access_token);
  //     localStorage.setItem("user", JSON.stringify(data.user));

  //     setUserInfo(data.user);

  //     // диспатчим в стор (если нужно)
  //     if (data.user) {
  //       dispatch({
  //         type: SET_USER_TELEGRAM_INFO,
  //         infoFromTelegram: data.user,
  //       });
  //     }

  //     // return data;
  //   } catch (err) {
  //     console.error("❌ Authentication failed:", err);
  //     setError(err.message || "Authentication error");
  //     // throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Получение текущего пользователя по токену
  // const fetchCurrentUser = async () => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   try {
  //     const response = await fetch(
  //       "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/me",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (!response.ok) {
  //       if (response.status === 401) {
  //         localStorage.removeItem("access_token");
  //         localStorage.removeItem("user");
  //       }

  //       throw new Error(`Ошибка ${response.status}`);
  //     }

  //     const data = await response.json();

  //     console.log(
  //       "это приходит по запросу https:/xn--80aqak6ae.xn--p1ai/api/v1/auth/me"
  //     );
  //     console.log(data);

  //     setUserInfo(data);
  //     dispatch({
  //       type: SET_USER_TELEGRAM_INFO,
  //       infoFromTelegram: data,
  //     });
  //   } catch (err) {
  //     setError(err.message || "Authentication error");
  //     console.error("Failed to fetch user data:", err);
  //   }
  // };

  // Основной эффект — реагируем на появление webApp и делаем одну логичную последовательность
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

    if (localStorage.getItem("access_token")) {
      dispatch(authenticationWithAccessToken());
    } else if (initData && initData.trim() !== "") {
      dispatch(authentication(initData));
    }
  }, [webApp, dispatch]);

  return (
    <>
      {userTelegramInfoRequest && (
        <p style={{ color: "blue" }}>Аутентификация...</p>
      )}

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
