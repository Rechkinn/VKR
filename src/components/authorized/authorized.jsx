import React, { useState, useEffect, useRef } from "react";
import App from "../app/app";
import { useDispatch } from "react-redux";
import {
  SET_USER_TELEGRAM_INFO,
  SET_USER_BACKEND_INFO,
} from "../../services/actions/user";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);

  const dispatch = useDispatch();

  // refs to prevent duplicate attempts and keep intervals for cleanup
  const authAttemptedRef = useRef(false);
  const webAppPollRef = useRef(null);
  const initDataPollRef = useRef(null);

  // --- Helper: parse initData (safer) ---
  const parseInitData = (initDataString) => {
    if (!initDataString) return null;
    try {
      // initData is key1=value1&key2=value2
      const params = new URLSearchParams(initDataString);
      const result = {};
      for (const [key, value] of params) {
        if (key === "user") {
          try {
            // sometimes user is URL encoded JSON
            const decoded = decodeURIComponent(value);
            result[key] = JSON.parse(decoded);
          } catch {
            try {
              result[key] = JSON.parse(value);
            } catch {
              result[key] = value;
            }
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

  // --- Authentication with backend ---
  const authenticateWithTelegram = async (initData) => {
    if (!initData) {
      throw new Error("No init data available");
    }

    // Avoid re-entrancy: mark attempted early (still try once)
    authAttemptedRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            init_data: initData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Authentication failed: ${response.status}`
        );
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user);
      dispatch({
        type: SET_USER_BACKEND_INFO,
        infoFromBackend: data.user,
      });

      console.log("✅ Authentication successful:", data);
      return data;
    } catch (err) {
      console.error("❌ Authentication failed:", err);
      setError(err.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch current user if token present ---
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        dispatch({
          type: SET_USER_BACKEND_INFO,
          infoFromBackend: userData,
        });
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // --- Initialize Telegram.WebApp when it becomes available (polling fallback) ---
  useEffect(() => {
    let stopped = false;

    const initTelegram = () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (!tg) return false;

        // only set once
        setWebApp((prev) => {
          if (prev) return prev;
          return tg;
        });

        // Safe calls (some methods might not exist in older injections)
        try {
          tg.ready?.();
          tg.expand?.();
          if (tg.setHeaderColor) tg.setHeaderColor("#0088cc");
          if (tg.setBackgroundColor) tg.setBackgroundColor("#ffffff");
        } catch (e) {
          console.warn("Telegram WebApp init helpers failed:", e);
        }

        console.log("Telegram WebApp initialized:", tg);
        console.log("Init Data (raw):", tg.initData);
        console.log("Init Data Unsafe:", tg.initDataUnsafe);
        return true;
      } catch (err) {
        console.error("initTelegram error:", err);
        return false;
      }
    };

    // Try immediately
    if (initTelegram()) return;

    // Polling: check for WebApp up to ~6 seconds
    let tries = 0;
    webAppPollRef.current = setInterval(() => {
      if (stopped) return;
      tries += 1;
      if (initTelegram()) {
        clearInterval(webAppPollRef.current);
        webAppPollRef.current = null;
      } else if (tries >= 30) {
        // stop after ~30 * 200ms = 6000ms
        clearInterval(webAppPollRef.current);
        webAppPollRef.current = null;
        if (!window.Telegram?.WebApp) {
          console.warn("Telegram WebApp not available after polling");
          setError(
            "Telegram WebApp not detected. Please open inside Telegram."
          );
        }
      }
    }, 200);

    return () => {
      stopped = true;
      if (webAppPollRef.current) {
        clearInterval(webAppPollRef.current);
        webAppPollRef.current = null;
      }
    };
    // empty deps: run once
  }, []);

  // --- When webApp becomes available: handle user data and authentication ---
  useEffect(() => {
    if (!webApp) return;

    // set debug info
    const setDebug = () =>
      setDebugInfo({
        initDataAvailable: !!webApp.initData,
        initDataLength: webApp.initData?.length || 0,
        initDataUnsafe: webApp.initDataUnsafe,
        hasToken: !!localStorage.getItem("access_token"),
      });
    setDebug();

    // If unsafe user exists — use it immediately
    try {
      const unsafe = webApp.initDataUnsafe;
      if (unsafe?.user) {
        setTelegramUser(unsafe.user);
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: unsafe.user,
        });
      } else {
        // Try to parse initData for user
        const parsed = parseInitData(webApp.initData);
        if (parsed?.user) {
          setTelegramUser(parsed.user);
          dispatch({
            type: SET_USER_TELEGRAM_INFO,
            infoFromTelegram: parsed.user,
          });
        }
      }
    } catch (e) {
      console.warn("Error extracting user from webApp:", e);
    }

    // If we already have initData -> authenticate
    const attemptAuthIfHasInitData = async () => {
      if (authAttemptedRef.current) return;
      const initData = webApp.initData;
      if (initData && initData.trim() !== "") {
        try {
          await authenticateWithTelegram(initData);
        } catch (err) {
          console.error(
            "authenticateWithTelegram failed on immediate attempt:",
            err
          );
        }
        return;
      }

      // If no initData yet, but there's a token, try to fetch current user
      if (localStorage.getItem("access_token")) {
        fetchCurrentUser();
        authAttemptedRef.current = true;
        return;
      }

      // If no initData, poll webApp.initData for a short time (mobile might inject with delay)
      let pollTries = 0;
      initDataPollRef.current = setInterval(async () => {
        pollTries += 1;
        const currentInit = webApp.initData;
        setDebug(); // update debug while waiting
        if (currentInit && String(currentInit).trim() !== "") {
          clearInterval(initDataPollRef.current);
          initDataPollRef.current = null;
          try {
            await authenticateWithTelegram(currentInit);
          } catch (err) {
            console.error(
              "authenticateWithTelegram failed after polling:",
              err
            );
          }
        } else if (pollTries >= 15) {
          // stop after ~15 * 200ms = 3s
          clearInterval(initDataPollRef.current);
          initDataPollRef.current = null;
          // If after polling nothing, allow manual retry
          authAttemptedRef.current = false; // we didn't succeed; allow user to retry
          console.warn("No initData found after short polling.");
        }
      }, 200);
    };

    attemptAuthIfHasInitData();

    return () => {
      if (initDataPollRef.current) {
        clearInterval(initDataPollRef.current);
        initDataPollRef.current = null;
      }
    };
  }, [webApp, dispatch]);

  // --- MainButton setup (close) ---
  useEffect(() => {
    if (!webApp || !webApp.MainButton) return;

    try {
      webApp.MainButton.setText("Close");
      webApp.MainButton.show();

      const handleClose = () => {
        try {
          webApp.close();
        } catch (e) {
          console.warn("webApp.close failed:", e);
        }
      };

      webApp.MainButton.onClick(handleClose);

      return () => {
        try {
          webApp.MainButton.offClick(handleClose);
        } catch (e) {
          // older versions might not have offClick
        }
      };
    } catch (e) {
      console.warn("Failed to setup MainButton:", e);
    }
  }, [webApp, userInfo]);

  // --- Manual retry button handler ---
  const handleManualAuth = () => {
    setError(null);
    if (!webApp) {
      setError("Telegram WebApp not detected. Please open inside Telegram.");
      return;
    }
    if (webApp.initData) {
      authenticateWithTelegram(webApp.initData).catch((err) =>
        console.error("Manual auth failed:", err)
      );
    } else if (webApp.initDataUnsafe?.user) {
      // If there is only unsafe user, still store it locally and ask user to proceed
      setTelegramUser(webApp.initDataUnsafe.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: webApp.initDataUnsafe.user,
      });
      setError("Init data not available yet — try again in a moment.");
    } else {
      setError("No init data available. Please open in Telegram.");
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

      {/* Debug info for development (remove in production if you want) */}
      <div style={{ display: "none" }}>
        {debugInfo && (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>

      {/* Render app when we have at least telegram user or backend user info */}
      {telegramUser || userInfo ? <App /> : null}
    </>
  );
};

export default TelegramAuth;
