import React, { useEffect, useRef, useState } from "react";
import App from "../app/app";
import { useDispatch } from "react-redux";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";

const AUTH_URL = "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram";
const ME_URL = "https://xn--80aqak6ae.xn--p1ai/api/v1/auth/me";

const TelegramAuth = () => {
  const dispatch = useDispatch();
  // Увеличим таймаут до 30s
  const { webapp, ready, initData, initDataUnsafe, forceAttach } =
    useTelegramWebApp({
      pollInterval: 250,
      pollTimeout: 30000,
    });

  const [telegramUser, setTelegramUser] = useState(null); // from unsafe or parsed initData
  const [userInfo, setUserInfo] = useState(null); // from backend (after auth)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authInProgress, setAuthInProgress] = useState(false);

  const authAttemptedRef = useRef(false);
  const longPollRef = useRef(null);

  // вспомогательный парсер (из строки initData -> user)
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

  // Авторизация на бэкенде
  const authenticateWithTelegram = async (initDataStr) => {
    if (!initDataStr) {
      throw new Error("No init data available");
    }
    authAttemptedRef.current = true;
    setLoading(true);
    setError(null);
    setAuthInProgress(true);
    try {
      const resp = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ init_data: initDataStr }),
      });
      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(
          errJson.detail || `Authentication failed: ${resp.status}`
        );
      }
      const data = await resp.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user);
      setAuthInProgress(false);
      return data;
    } catch (err) {
      console.error("Authentication failed:", err);
      setError(err.message || String(err));
      setAuthInProgress(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const resp = await fetch(ME_URL, {
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
      console.error("Failed to fetch user data:", err);
    }
  };

  // --- fast path: если есть initDataUnsafe.user — сразу устанавливаем telegramUser и диспатчим в стор
  useEffect(() => {
    if (initDataUnsafe?.user) {
      setTelegramUser(initDataUnsafe.user);
      dispatch({
        type: SET_USER_TELEGRAM_INFO,
        infoFromTelegram: initDataUnsafe.user,
      });
      // не пытаемся аутентифицировать неподписанные данные — ждём подписанный initData
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initDataUnsafe, initData]);

  // --- основный поток: если есть initData -> аутентифицируем; если нет -> короткий long poll (до 30s)
  useEffect(() => {
    // если webapp не доступен — ничего не делаем
    if (!webapp) return;

    // если initData есть сразу — аутентифицируем (если ещё не пытались)
    if (webapp.initData && String(webapp.initData).trim() !== "") {
      if (!authAttemptedRef.current) {
        authenticateWithTelegram(webapp.initData).catch((e) =>
          console.warn("auth immediate failed", e)
        );
      }
      return;
    }

    // если токен есть — подтянуть текущего пользователя
    if (localStorage.getItem("access_token")) {
      fetchCurrentUser();
      authAttemptedRef.current = true;
      return;
    }

    // иначе — long poll initData до 30s (шаг 250ms)
    const maxTries = Math.ceil(30000 / 250); // 30s
    let tries = 0;
    longPollRef.current = setInterval(async () => {
      tries += 1;
      const currentInit = webapp.initData;
      if (currentInit && String(currentInit).trim() !== "") {
        clearInterval(longPollRef.current);
        longPollRef.current = null;
        if (!authAttemptedRef.current) {
          try {
            await authenticateWithTelegram(currentInit);
          } catch (e) {
            console.warn("auth after poll failed", e);
          }
        }
      } else if (tries >= maxTries) {
        clearInterval(longPollRef.current);
        longPollRef.current = null;
        // если за 30s не пришёл initData — даём возможность пользователю retry
        console.warn("initData did not arrive after 30s poll");
      }
    }, 250);

    // также при возвращении фокуса/visibilitychange — можно форс-аттач (если используешь hook с forceAttach)
    const onVisibility = () => {
      if (typeof forceAttach === "function") {
        forceAttach();
      }
    };
    window.addEventListener("focus", onVisibility);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (longPollRef.current) {
        clearInterval(longPollRef.current);
        longPollRef.current = null;
      }
      window.removeEventListener("focus", onVisibility);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webapp]);

  // ручной retry
  const handleManualAuth = async () => {
    setError(null);
    if (!webapp) {
      setError("Telegram WebApp not detected. Откройте в приложении Telegram.");
      return;
    }

    const id = webapp.initData;
    if (id && String(id).trim() !== "") {
      try {
        await authenticateWithTelegram(id);
      } catch (e) {
        console.warn("manual auth failed", e);
      }
      return;
    }

    // если нет initData — форс повторную попытку прикрепления (hook должен реализовать forceAttach)
    if (typeof forceAttach === "function") {
      forceAttach();
    }
    setError(
      "Init data отсутствует. Попытка повторной привязки запущена — пожалуйста, подождите или нажмите Retry ещё раз."
    );
  };

  // Если у нас есть только telegramUser (unsafe) — показываем App, но помечаем, что аутентификация в фоне
  const showApp = !!telegramUser || !!userInfo;

  return (
    <>
      {loading && (
        <p style={{ margin: 0, color: "#1976d2" }}>🔄 Authenticating...</p>
      )}

      {!showApp && (
        <div>
          <p>Ожидание Telegram WebApp...</p>
          <p style={{ fontSize: 13, color: "#666" }}>
            Если вы в мобильном Telegram — подождите до 30 секунд. Если ничего
            не происходит — нажмите Retry.
          </p>
          <button onClick={handleManualAuth}>🔄 Retry</button>
        </div>
      )}

      {/* Если есть небезопасный пользователь — показываем предупреждение и отображаем app сразу */}
      {telegramUser && !userInfo && (
        <div
          style={{
            padding: 8,
            background: "#fff9c4",
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <strong>Внимание:</strong> загружено локальное инфо из Telegram (без
          серв.подтверждения). Аутентификация может завершиться чуть позже.
          {authInProgress && (
            <div style={{ marginTop: 6 }}>
              Выполняется фоновая аутентификация...
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 10 }}>
          <p>❌ Ошибка: {error}</p>
          <button onClick={handleManualAuth}>🔄 Retry</button>
        </div>
      )}

      {/* Рендерим приложение, если есть хотя бы информация из Telegram (unsafe) или из бэкенда */}
      {showApp && <App />}
    </>
  );
};

export default TelegramAuth;
