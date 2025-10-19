// src/components/TelegramAuth.jsx
import React, { useEffect, useRef, useState } from "react";
import App from "../app/app";
import { useDispatch } from "react-redux";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";

const AUTH_URL = "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram";
const ME_URL = "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/me";

export default function TelegramAuth() {
  const dispatch = useDispatch();
  const { webapp, ready, initData, initDataUnsafe, forceAttach } =
    useTelegramWebApp({
      pollInterval: 250,
      pollTimeout: 15000,
    });

  const [telegramUser, setTelegramUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);

  const authAttemptRef = useRef(false);
  const initPollRef = useRef(null);

  const log = (msg) => {
    const entry = `${new Date().toISOString()} — ${msg}`;
    setDebugLog((d) => [...d.slice(-50), entry]); // keep last 50
    console.log(entry);
  };

  // parse initData -> user
  const parseInitData = (s) => {
    if (!s) return null;
    try {
      const params = new URLSearchParams(s);
      const res = {};
      for (const [k, v] of params) {
        if (k === "user") {
          try {
            res[k] = JSON.parse(decodeURIComponent(v));
          } catch {
            try {
              res[k] = JSON.parse(v);
            } catch {
              res[k] = v;
            }
          }
        } else res[k] = v;
      }
      return res;
    } catch (e) {
      return { raw: s };
    }
  };

  // authenticate
  const authenticateWithTelegram = async (initStr) => {
    if (!initStr) throw new Error("no initData");
    authAttemptRef.current = true;
    setLoading(true);
    setError(null);
    log("auth: start");
    try {
      const resp = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ init_data: initStr }),
      });
      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.detail || `status ${resp.status}`);
      }
      const data = await resp.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user);
      log("auth: success");
      return data;
    } catch (e) {
      log(`auth: fail ${e.message}`);
      setError(e.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // fetch current user if token present
  const fetchCurrentUser = async () => {
    const t = localStorage.getItem("access_token");
    if (!t) return;
    try {
      const r = await fetch(ME_URL, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (r.ok) {
        const u = await r.json();
        setUserInfo(u);
        log("fetched current user");
      } else if (r.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (e) {
      log("fetchCurrentUser err: " + e.message);
    }
  };

  // whenever initDataUnsafe or initData changes — set user fast-path
  useEffect(() => {
    if (initDataUnsafe?.user) {
      setTelegramUser(initDataUnsafe.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: initDataUnsafe.user,
      });
      log("user from initDataUnsafe set");
    } else if (initData) {
      const p = parseInitData(initData);
      if (p?.user) {
        setTelegramUser(p.user);
        dispatch({ type: SET_USER_TELEGRAM_INFO, infoFromTelegram: p.user });
        log("user from initData string set");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData, initDataUnsafe]);

  // main auth flow: immediate auth if initData present, else short poll, else token
  useEffect(() => {
    if (!webapp) {
      log("webapp not attached yet");
      return;
    }
    log("webapp attached");

    // set header/background if available
    try {
      webapp.setHeaderColor && webapp.setHeaderColor("#0088cc");
      webapp.setBackgroundColor && webapp.setBackgroundColor("#ffffff");
      webapp.expand && webapp.expand();
    } catch (e) {
      log("UI calls failed: " + e.message);
    }

    const attempt = async () => {
      const id = webapp.initData;
      if (id && String(id).trim() !== "") {
        if (!authAttemptRef.current) {
          try {
            await authenticateWithTelegram(id);
          } catch (e) {
            log("immediate auth failed");
          }
        }
        return;
      }

      if (localStorage.getItem("access_token")) {
        fetchCurrentUser();
        authAttemptRef.current = true;
        return;
      }

      // short poll initData up to ~12s
      let tries = 0;
      const maxTries = 48; // 48 * 250ms = 12s
      initPollRef.current = setInterval(async () => {
        tries += 1;
        const cur = webapp.initData;
        if (cur && String(cur).trim() !== "") {
          clearInterval(initPollRef.current);
          initPollRef.current = null;
          try {
            await authenticateWithTelegram(cur);
          } catch (e) {
            log("auth after poll failed");
          }
        } else if (tries >= maxTries) {
          clearInterval(initPollRef.current);
          initPollRef.current = null;
          log("initData not arrived after poll");
        }
      }, 250);
    };

    attempt();

    return () => {
      if (initPollRef.current) {
        clearInterval(initPollRef.current);
        initPollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webapp]);

  const handleManualAuth = async () => {
    setError(null);
    if (!webapp) {
      setError("Telegram WebApp not detected. Please open inside Telegram.");
      return;
    }
    const id = webapp.initData;
    if (id && String(id).trim() !== "") {
      authenticateWithTelegram(id).catch(() => {});
    } else {
      // force re-attach attempt (in case injection happened very late)
      forceAttach();
      setError(
        "Init data not present yet — tried to re-attach. If problem persists, try opening in Telegram app."
      );
    }
  };

  // show debug logs when needed (you can hide in prod)
  const showDebug = true;

  return (
    <>
      {loading && (
        <p style={{ margin: 0, color: "#1976d2" }}>🔄 Authenticating...</p>
      )}

      {!loading && !userInfo && !telegramUser && (
        <div>
          <p>Ожидание Telegram WebApp...</p>
          <p style={{ fontSize: 13, color: "#666" }}>
            Если вы в мобильном Telegram, подождите несколько секунд. Если
            ничего не происходит — нажмите Retry.
          </p>
          <button onClick={handleManualAuth}>🔄 Retry</button>
        </div>
      )}

      {error && (
        <div>
          <p>❌ Ошибка: {error}</p>
          <button onClick={handleManualAuth}>🔄 Retry</button>
        </div>
      )}

      {showDebug && (
        <pre
          style={{ whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto" }}
        >
          {debugLog.join("\n")}
        </pre>
      )}

      {telegramUser || userInfo ? <App /> : null}
    </>
  );
}
