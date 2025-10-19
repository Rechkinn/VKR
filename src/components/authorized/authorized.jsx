// src/components/TelegramAuth.jsx
import React, { useEffect, useRef, useState } from "react";
import App from "../app/app";
import { useDispatch } from "react-redux";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";

const TELEGRAM_AUTH_URL = "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram";
const TELEGRAM_ME_URL = "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/me";

const TelegramAuth = () => {
  const dispatch = useDispatch();

  const { webapp, ready, initData, initDataUnsafe } = useTelegramWebApp();
  const [telegramUser, setTelegramUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const authAttemptedRef = useRef(false);
  const initPollRef = useRef(null);

  // safe parse of initData string -> object
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

  // authenticate to backend
  const authenticateWithTelegram = async (initDataStr) => {
    if (!initDataStr) throw new Error("No init data available");
    // mark attempted early to avoid double attempts
    authAttemptedRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(TELEGRAM_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ init_data: initDataStr }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(
          errJson.detail || `Authentication failed: ${response.status}`
        );
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user);
      return data;
    } catch (err) {
      console.error("authenticateWithTelegram error:", err);
      setError(err.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // fetch current user if we already have token
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const resp = await fetch(TELEGRAM_ME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const user = await resp.json();
        setUserInfo(user);
      } else if (resp.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("fetchCurrentUser error:", err);
    }
  };

  // When webapp or initDataUnsafe changes — set telegram user immediately (fast path)
  useEffect(() => {
    if (initDataUnsafe?.user) {
      setTelegramUser(initDataUnsafe.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: initDataUnsafe.user,
      });
    } else if (initData) {
      const parsed = parseInitData(initData);
      if (parsed?.user) {
        setTelegramUser(parsed.user);
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: parsed.user,
        });
      }
    }
    setDebugInfo({
      ready,
      hasInit: !!initData,
      initLen: initData?.length || 0,
      hasToken: !!localStorage.getItem("access_token"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData, initDataUnsafe, ready]);

  // Authentication flow: try immediate, else short-poll for initData, else use token
  useEffect(() => {
    if (!webapp) return;

    // attempt immediate auth if we have initData
    const tryAuthImmediately = async () => {
      const id = webapp.initData;
      if (id && String(id).trim() !== "") {
        if (!authAttemptedRef.current) {
          try {
            await authenticateWithTelegram(id);
          } catch (e) {
            console.warn("Immediate authenticate failed:", e);
          }
        }
        return;
      }

      // if token exists — fetch user
      if (localStorage.getItem("access_token")) {
        fetchCurrentUser();
        authAttemptedRef.current = true;
        return;
      }

      // else, short poll initData for a few seconds (mobile may inject later)
      let tries = 0;
      const maxTries = 15; // ~15 * 200ms = 3s
      initPollRef.current = setInterval(async () => {
        tries += 1;
        const currentInit = webapp.initData;
        if (currentInit && String(currentInit).trim() !== "") {
          clearInterval(initPollRef.current);
          initPollRef.current = null;
          if (!authAttemptedRef.current) {
            try {
              await authenticateWithTelegram(currentInit);
            } catch (e) {
              console.warn("Auth after poll failed:", e);
            }
          }
        } else if (tries >= maxTries) {
          clearInterval(initPollRef.current);
          initPollRef.current = null;
          // give control to manual retry (user can press retry)
          authAttemptedRef.current = false;
          console.warn("initData not available after short poll");
        }
      }, 200);
    };

    // set header/background and expand safely
    try {
      webapp.setHeaderColor && webapp.setHeaderColor("#0088cc");
      webapp.setBackgroundColor && webapp.setBackgroundColor("#ffffff");
      webapp.ready && typeof webapp.ready === "function" && webapp.ready();
      webapp.expand && typeof webapp.expand === "function" && webapp.expand();
    } catch (e) {
      console.warn("webapp UI calls failed:", e);
    }

    tryAuthImmediately();

    return () => {
      if (initPollRef.current) {
        clearInterval(initPollRef.current);
        initPollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webapp]);

  // MainButton (close) setup — only when we already have backend user info
  useEffect(() => {
    if (!webapp || !webapp.MainButton || !userInfo) return;
    const mb = webapp.MainButton;
    try {
      mb.setText && mb.setText("Close");
      mb.show && mb.show();

      const onClick = () => {
        try {
          webapp.close && webapp.close();
        } catch (e) {
          console.warn(e);
        }
      };

      mb.onClick && mb.onClick(onClick);

      return () => {
        mb.offClick && mb.offClick(onClick);
      };
    } catch (e) {
      console.warn("MainButton setup failed:", e);
    }
  }, [webapp, userInfo]);

  const handleManualAuth = () => {
    setError(null);
    if (!webapp) {
      setError("Telegram WebApp not detected. Please open inside Telegram.");
      return;
    }
    const id = webapp.initData;
    if (id && String(id).trim() !== "") {
      authenticateWithTelegram(id).catch((e) =>
        console.error("Manual auth error:", e)
      );
    } else if (webapp.initDataUnsafe?.user) {
      setTelegramUser(webapp.initDataUnsafe.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: webapp.initDataUnsafe.user,
      });
      setError(
        "Init data not present yet — try manual auth again in a moment."
      );
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

      {/* Dev debug — можно скрыть/удалить в проде */}
      <div style={{ display: "none" }}>
        {debugInfo && (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>

      {telegramUser || userInfo ? <App /> : null}
    </>
  );
};

export default TelegramAuth;
