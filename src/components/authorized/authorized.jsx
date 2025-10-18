import React, { useState, useEffect, useRef } from "react";
import App from "../app/app";
import { useDispatch } from "react-redux";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // окончательные/локальные данные профиля
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null); // данные из initDataUnsafe.user

  const dispatch = useDispatch();
  const authAttemptedRef = useRef(false);
  const mainBtnHandlerRef = useRef(null);

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

  // Вспомогательная: аккуратно строим отображаемое имя (без undefined)
  const buildDisplayName = (u) => {
    if (!u) return "";
    const parts = [];
    if (u.first_name) parts.push(u.first_name);
    else if (u.username) parts.push(u.username);
    if (u.last_name) parts.push(u.last_name);
    return parts.join(" ").trim();
  };

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
      try {
        tgWebApp.ready();
        if (typeof tgWebApp.expand === "function") tgWebApp.expand();
        if (typeof tgWebApp.setHeaderColor === "function")
          tgWebApp.setHeaderColor("#0088cc");
        if (typeof tgWebApp.setBackgroundColor === "function")
          tgWebApp.setBackgroundColor("#ffffff");
      } catch (e) {
        console.warn("Telegram WebApp init warning:", e);
      }
    } else {
      setError("Telegram WebApp not detected. Please open in Telegram.");
    }
  }, []);

  const authenticateWithTelegram = async (initData) => {
    if (!initData) throw new Error("No init data available");
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
      const data = parsedBody;
      if (!data || !data.access_token) {
        throw new Error("Invalid auth response from server");
      }
      localStorage.setItem("access_token", data.access_token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user) {
        setUserInfo(data.user);
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: { ...data.user },
        });
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
        const actual = payload.user ?? payload;
        setUserInfo(actual);
        if (actual)
          dispatch({ type: SET_USER_TELEGRAM_INFO, infoFromTelegram: actual });
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // Главное: реагируем на webApp появление
  useEffect(() => {
    if (!webApp) return;

    const unsafe = webApp.initDataUnsafe;
    const initData = webApp.initData;

    // debug
    setDebugInfo({
      initDataAvailable: !!initData,
      initDataLength: initData?.length || 0,
      initDataUnsafe: unsafe,
      hasToken: !!localStorage.getItem("access_token"),
      platform: webApp.platform ?? null,
    });

    // Если есть unsafe.user, используем его для немедленного UI (помогает избежать "Dev undefined")
    if (unsafe?.user) {
      setTelegramUser(unsafe.user);
      // Заполняем userInfo временно, чтобы UI мог отобразить имя/аватар сразу
      // НЕ заменяет серверную проверку — это только UI fallback
      setUserInfo((prev) => prev ?? unsafe.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: { ...unsafe.user },
      });
    }

    // Если ещё не делали попытку аутентификации — попробуем по initData (подписанному)
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

    // MainButton setup (корректная очистка)
    if (webApp.MainButton) {
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

        const maybeOff = webApp.MainButton.onClick?.(handler);
        return () => {
          if (typeof maybeOff === "function") {
            maybeOff();
          } else if (webApp.MainButton.offClick) {
            try {
              webApp.MainButton.offClick(handler);
            } catch (e) {
              // ignore if not supported
            }
          }
        };
      } catch (e) {
        console.warn("Failed to setup MainButton:", e);
      }
    }
    return undefined;
  }, [webApp, dispatch]);

  const handleManualAuth = () => {
    if (webApp?.initData) {
      authenticateWithTelegram(webApp.initData).catch((err) => {
        console.error("Manual auth failed:", err);
      });
    } else {
      setError("No init data available. Please open inside Telegram.");
    }
  };

  // Рендер: показываем App, если есть хотя бы временные данные пользователя (unsafe) или окончательные userInfo
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

      {/* debug */}
      {/* {debugInfo && <pre>{JSON.stringify(debugInfo, null, 2)}</pre>} */}

      {/* Показываем приложение, если есть хоть какие-то данные пользователя */}
      {(telegramUser || userInfo) && <App />}

      {!telegramUser && !userInfo && !loading && (
        <div style={{ color: "#666", marginTop: 12 }}>
          Откройте мини-приложение внутри Telegram (в мобильном/десктопе). Если
          вы в браузере — убедитесь, что приложение запущено через кнопку
          бота/inline-клавиатуру.
        </div>
      )}
    </>
  );
};

export default TelegramAuth;
