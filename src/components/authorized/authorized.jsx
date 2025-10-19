import React, { useState, useEffect, useRef } from "react";
import App from "../app/app";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_USER_BACKEND_INFO,
  SET_USER_TELEGRAM_INFO,
} from "../../services/actions/user";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);

  // const { userMyData } = useSelector((store) => store.user);
  // console.log("userMyData ------- ");
  // console.log(userMyData);
  // console.log("userMyData ------- ");

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
            // fallback: keep raw value
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
      setUserInfo(data.user);

      if (data.user) {
        console.log("data.user");
        console.log(data.user);
        dispatch({
          type: SET_USER_BACKEND_INFO,
          infoFromBackend: data.user,
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
        setUserInfo(payload.user ?? payload);
        // optionally dispatch if your app expects it in the store:
        if (payload.user ?? payload) {
          dispatch({
            type: SET_USER_TELEGRAM_INFO,
            infoFromTelegram: payload.user ?? payload,
          });
        }
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    if (!webApp) return;

    const unsafe = webApp.initDataUnsafe;
    const initData = webApp.initData;

    setDebugInfo({
      initDataAvailable: !!initData,
      initDataLength: initData?.length || 0,
      initDataUnsafe: unsafe,
      hasToken: !!localStorage.getItem("access_token"),
      platform: webApp.platform ?? null,
    });

    if (unsafe?.user) {
      setTelegramUser(unsafe.user);
      console.log("unsafe.user", unsafe.user);
      dispatch({ type: SET_USER_TELEGRAM_INFO, infoFromTelegram: unsafe.user });
    } else {
      const parsed = parseInitData(initData);
      if (parsed?.user) {
        setTelegramUser(parsed.user);
        console.log("parsed.user", parsed.user);

        // <<< ВАЖНО: диспатчим parsed.user в стор, как в unsafe ветке >>>
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: parsed.user,
        });
      }
    }

    if (!authAttemptedRef.current) {
      if (initData && initData.trim() !== "") {
        authAttemptedRef.current = true;
        authenticateWithTelegram(initData).catch((err) => {
          console.error("Auth attempt failed:", err);
        });
      } else if (localStorage.getItem("access_token")) {
        fetchCurrentUser();
      }
    }

    // НЕ возвращаем cleanup здесь — обработку MainButton вынесем в отдельный useEffect
  }, [webApp, dispatch]);

  // Отдельный useEffect для MainButton (чистая регистрация/отписка)
  useEffect(() => {
    if (!webApp || !webApp.MainButton) return;

    const btn = webApp.MainButton;
    try {
      btn.setText?.("Close");
      // иногда show может быть не методом — проверяем
      if (typeof btn.show === "function") btn.show();

      const handler = () => {
        try {
          webApp.close();
        } catch (e) {
          console.warn("Failed to close webApp:", e);
        }
      };
      mainBtnHandlerRef.current = handler;

      // subscribe: onClick may not return unsubscribe, so keep handler ref to offClick
      if (typeof btn.onClick === "function") {
        btn.onClick(handler);
      } else if (btn.addEventListener) {
        // defensive: some implementations may have different API
        btn.addEventListener("click", handler);
      }

      return () => {
        try {
          if (typeof btn.offClick === "function") {
            btn.offClick(handler);
          } else if (
            typeof btn.onClick === "function" &&
            btn.removeEventListener
          ) {
            btn.removeEventListener("click", handler);
          }
        } catch (e) {
          console.warn("Failed to cleanup MainButton handler:", e);
        }
      };
    } catch (e) {
      console.warn("Failed to setup MainButton:", e);
      return undefined;
    }
  }, [webApp]);

  const handleManualAuth = () => {
    if (webApp?.initData) {
      authenticateWithTelegram(webApp.initData).catch((err) => {
        console.error("Manual auth failed:", err);
      });
    } else {
      setError("No init data available. Please open inside Telegram.");
    }
  };

  // Флаг — показывать fallback-кнопку (дополнительно к MainButton)
  const shouldShowFallbackClose =
    webApp &&
    (!webApp.MainButton ||
      (typeof webApp.MainButton.isVisible === "function"
        ? !webApp.MainButton.isVisible()
        : webApp.MainButton.isVisible === false));

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

      {(telegramUser || userInfo) && (
        <>
          <App />
        </>
      )}

      {!telegramUser && !userInfo && !loading && (
        <div style={{ color: "#666", marginTop: 12 }}>
          Откройте мини-приложение внутри Telegram (в мобильном/десктопе). Если
          вы в браузере — убедитесь, что приложение запущено через кнопку
          бота/inline-клавиатуру, чтобы telegram передал initData.
        </div>
      )}

      {/* fallback DOM-кнопка Close — на случай, если MainButton не отображается */}
      {shouldShowFallbackClose && webApp && (
        <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }}>
          <button
            onClick={() => {
              try {
                webApp.close();
              } catch (e) {
                console.warn("webApp.close() failed:", e);
              }
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default TelegramAuth;
