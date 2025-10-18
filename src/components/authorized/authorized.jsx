import React, { useState, useEffect, useRef } from "react";
import App from "../app/app";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);

  const [userInfoForSave, setUserInfoForSave] = useState({});

  let myCustomData = {};
  let myCustomUnsafe = {};

  const { infoFromTelegram } = useSelector((store) => store.user);

  const dispatch = useDispatch();

  // Флаг, чтобы не запускать authenticate несколько раз
  const authAttemptedRef = useRef(false);
  // Храним ссылку на обработчик main button, чтобы коректно снять
  const mainBtnHandlerRef = useRef(null);

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
        if (typeof tgWebApp.setHeaderColor === "function")
          tgWebApp.setHeaderColor("#0088cc");
        if (typeof tgWebApp.setBackgroundColor === "function")
          tgWebApp.setBackgroundColor("#ffffff");

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

      // Попытка безопасно распарсить тело ошибки/ответа
      const text = await response.text();
      let parsedBody = null;
      try {
        parsedBody = text ? JSON.parse(text) : null;
      } catch {
        parsedBody = { raw: text };
      }

      if (!response.ok) {
        const detail = parsedBody?.detail || parsedBody?.message || null;
        throw new Error(detail || `Authentication failed: ${response.status}`);
      }

      // ожидаем структуру { access_token, user }
      const data = parsedBody;
      if (!data || !data.access_token) {
        throw new Error("Invalid auth response from server");
      }

      localStorage.setItem("access_token", data.access_token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user);

      // диспатчим в стор (если нужно)
      if (data.user) {
        console.log("data.user");
        console.log(data.user);

        myCustomData = { ...data.user };

        // setUserInfoForSave({ ...userInfoForSave, ...data.user });
        // dispatch({
        //   type: SET_USER_TELEGRAM_INFO,
        //   infoFromTelegram: {
        //     ...infoFromTelegram,
        //     ...data.user,
        //   },
        // });
      }

      return data;
    } catch (err) {
      console.error("❌ Authentication failed:", err);
      setError(err.message || "Authentication error");
      throw err;
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

      if (response.ok) {
        const payload = await response.json();
        // В разных API ответ может быть { user: {...} } или сразу объект пользователя
        setUserInfo(payload.user ?? payload);
        if (payload.user ?? payload) {
          console.log("payload");
          console.log(payload);
          console.log("payload.user");
          console.log(payload.user);
          // dispatch({
          //   type: SET_USER_TELEGRAM_INFO,
          //   infoFromTelegram: payload.user ?? payload,
          // });
        }
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // Основной эффект — реагируем на появление webApp и делаем одну логичную последовательность
  useEffect(() => {
    if (!webApp) return;

    const unsafe = webApp.initDataUnsafe;
    const initData = webApp.initData;

    // debug info
    setDebugInfo({
      initDataAvailable: !!initData,
      initDataLength: initData?.length || 0,
      initDataUnsafe: unsafe,
      hasToken: !!localStorage.getItem("access_token"),
      platform: webApp.platform ?? null,
    });

    // Если есть user в unsafe — используем его сразу
    if (unsafe?.user) {
      setTelegramUser(unsafe.user);
      console.log("unsafe.user");
      console.log(unsafe.user);

      myCustomUnsafe = { ...unsafe.user };

      console.log("myCustomData");
      console.log(myCustomData);
      console.log("myCustomUnsafe");
      console.log(myCustomUnsafe);

      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: Object.assign(myCustomData, myCustomUnsafe),
      });
    } else {
      // пробуем спарсить initData (если есть)
      const parsed = parseInitData(initData);
      if (parsed?.user) {
        setTelegramUser(parsed.user);
        console.log("parsed.user");
        console.log(parsed.user);
        // dispatch({
        //   type: SET_USER_TELEGRAM_INFO,
        //   infoFromTelegram: parsed.user,
        // });
      }
    }

    // Если уже есть токен в localStorage — пробуем получить профиль
    if (!authAttemptedRef.current) {
      if (initData && initData.trim() !== "") {
        authAttemptedRef.current = true;
        authenticateWithTelegram(initData).catch((err) => {
          console.error("Auth attempt failed:", err);
        });
      } else if (localStorage.getItem("access_token")) {
        // нет initData, но есть токен — получаем профиль
        fetchCurrentUser();
      }
    }

    // Настройка MainButton (показываем кнопку закрыть если есть userInfo)
    if (
      webApp.MainButton &&
      (webApp.MainButton.show || webApp.MainButton.onClick)
    ) {
      try {
        webApp.MainButton.setText?.("Close");
        webApp.MainButton.show?.();

        const handler = () => {
          try {
            webApp.close();
          } catch (e) {
            console.warn("Failed to close webApp:", e);
          }
        };

        mainBtnHandlerRef.current = handler;

        // API: onClick может возвращать функцию off, либо использовать offClick
        const maybeOff = webApp.MainButton.onClick?.(handler);
        // если onClick вернул функцию, используем её при очистке
        return () => {
          if (typeof maybeOff === "function") {
            maybeOff();
          } else if (webApp.MainButton.offClick) {
            webApp.MainButton.offClick(handler);
          }
        };
      } catch (e) {
        console.warn("Failed to setup MainButton:", e);
      }
    }
    // если ничего возвращаем — cleanup не требуется
    return undefined;
  }, [webApp, dispatch]);

  // ручная аутентификация (кнопка Retry)
  const handleManualAuth = () => {
    if (webApp?.initData) {
      authenticateWithTelegram(webApp.initData).catch((err) => {
        console.error("Manual auth failed:", err);
      });
    } else {
      setError("No init data available. Please open inside Telegram.");
    }
  };

  return (
    <>
      {loading && (
        <p style={{ margin: 0, color: "#1976d2" }}>🔄 Authenticating...</p>
      )}

      {error && (
        <div>
          <p>❌ Authentication Error</p>
          <p>{error}</p>
          <button onClick={handleManualAuth}>🔄 Retry Authentication</button>
        </div>
      )}

      {/* Место для отладки — показываем только если есть debugInfo */}
      {/* {debugInfo && (
        <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
          <div>initDataAvailable: {String(debugInfo.initDataAvailable)}</div>
          <div>initDataLength: {debugInfo.initDataLength}</div>
          <div>hasToken: {String(debugInfo.hasToken)}</div>
        </div>
      )} */}

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
