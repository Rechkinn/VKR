import React, { useState, useEffect, useRef } from "react";
import App from "../app/app";
import { useDispatch } from "react-redux";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);

  const dispatch = useDispatch();

  // Флаг, чтобы не запускать authenticate несколько раз
  const authAttemptedRef = useRef(false);

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
      console.error("Error parsing initData:", err);
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

        // Подстройка внешнего вида (в новых версиях методы поддерживаются)
        // if (typeof tgWebApp.setHeaderColor === "function")
        //   tgWebApp.setHeaderColor("#0088cc");
        // if (typeof tgWebApp.setBackgroundColor === "function")
        //   tgWebApp.setBackgroundColor("#ffffff");

        console.log("Telegram WebApp initialized:", tgWebApp);
      } catch (e) {
        console.warn("Telegram WebApp initialization warning:", e);
      }
    } else {
      console.warn(
        "Telegram WebApp not available - running in development mode or outside Telegram."
      );
      setError("Telegram WebApp not detected. Please open in Telegram.");
    }
  }, []);

  // Универсальная функция аутентификации (без утечек)
  const authenticateWithTelegram = async (initData) => {
    if (!initData) {
      throw new Error("No init data available");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ init_data: initData }),
        }
      );

      if (!response.ok) {
        const detail = parsedBody?.detail || parsedBody?.message || null;
        throw new Error(detail || `Authentication failed: ${response.status}`);
      }

      console.log("response");
      console.log(response);

      const data = await response.json();
      console.log(data);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUserInfo(data.user);

      // диспатчим в стор (если нужно)
      if (data.user) {
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: data.user,
        });
      }

      // return data;
    } catch (err) {
      console.error("❌ Authentication failed:", err);
      setError(err.message || "Authentication error");
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  // Получение текущего пользователя по токену
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }

        throw new Error(`Ошибка ${response.status}`);
      }

      const data = await response.json();
      setUserInfo(data.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: data.user,
      });
    } catch (err) {
      setError(err.message || "Authentication error");
      console.error("Failed to fetch user data:", err);
    }
  };

  // Основной эффект — реагируем на появление webApp и делаем одну логичную последовательность
  useEffect(() => {
    if (!webApp) return;

    const unsafe = webApp.initDataUnsafe;
    const initData = webApp.initData;

    console.log("unsafe");
    console.log(unsafe);
    console.log("initData");
    console.log(initData);

    // Если есть user в unsafe — используем его сразу
    if (unsafe?.user) {
      setTelegramUser(unsafe.user);

      dispatch({ type: SET_USER_TELEGRAM_INFO, infoFromTelegram: unsafe.user });
    } else {
      // пробуем спарсить initData (если есть)
      const parsed = parseInitData(initData);
      if (parsed?.user) {
        setTelegramUser(parsed.user);
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: parsed.user,
        });
      }
    }

    // Если уже есть токен в localStorage — пробуем получить профиль
    console.log("перед аутентифицкацией");
    // if (!authAttemptedRef.current) {
    console.log("аутентифицируемся..........");
    if (initData && initData.trim() !== "") {
      console.log("прошла аутентификация");
      authAttemptedRef.current = true;
      authenticateWithTelegram(initData);
    } else if (localStorage.getItem("access_token")) {
      console.log("аутентификация по токену");
      // нет initData, но есть токен — получаем профиль
      fetchCurrentUser();
    }
    // }

    return undefined;
  }, [webApp, dispatch]);

  // ручная аутентификация (кнопка Retry)
  // const handleManualAuth = () => {
  //   if (webApp?.initData) {
  //     authenticateWithTelegram(webApp.initData).catch((err) => {
  //       console.error("Manual auth failed:", err);
  //     });
  //   } else {
  //     setError("No init data available. Please open inside Telegram.");
  //   }
  // };

  return (
    <>
      {loading && (
        <p style={{ margin: 0, color: "#1976d2" }}>🔄 Authenticating...</p>
      )}

      {error && (
        <div>
          <p>❌ Authentication Error</p>
          <p>{error}</p>
          {/* <button onClick={handleManualAuth}>🔄 Retry Authentication</button> */}
        </div>
      )}

      {/* показываем основной апп, если есть telegramUser или userInfo */}
      {(telegramUser || userInfo) && <App />}

      {/* если ничего нет — краткая подсказка */}
      {!telegramUser && !userInfo && !loading && (
        <div style={{ color: "#666", marginTop: 12 }}>
          Откройте мини-приложение внутри Telegram (в мобильном/десктопе). Если
          вы в браузере — убедитесь, что приложение запущено через кнопку
          бота/inline-клавиатуру, чтобы telegram передал initData.
        </div>
      )}
    </>
  );
};

export default TelegramAuth;
