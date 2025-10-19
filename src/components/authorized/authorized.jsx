import React, { useState, useEffect, useRef } from "react";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // предотвращаем повторные попытки аутентификации
  const authAttemptedRef = useRef(false);
  // ссылка на handler main button для корректной отписки
  const mainBtnHandlerRef = useRef(null);

  // парсер initData (оставляем ваш)
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

  // Инициализация Telegram WebApp (безопасно — делаем feature detection)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp ?? null;
    if (!tg) {
      console.warn(
        "Telegram WebApp not available - running in development mode"
      );
      setError("Telegram WebApp not detected. Please open in Telegram.");
      return;
    }

    setWebApp(tg);

    try {
      if (typeof tg.ready === "function") tg.ready();
      if (typeof tg.expand === "function") tg.expand();

      if (typeof tg.setHeaderColor === "function") tg.setHeaderColor("#0088cc");
      if (typeof tg.setBackgroundColor === "function")
        tg.setBackgroundColor("#ffffff");

      console.log("Telegram WebApp initialized:", tg);
      console.log("Init Data:", tg.initData);
      console.log("Init Data Unsafe:", tg.initDataUnsafe);
    } catch (e) {
      console.warn("Telegram WebApp init warning:", e);
    }
  }, []);

  // Authenticate: отправляем initData на бэк (ваша реализация)
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            init_data: initData,
          }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid response from auth endpoint");
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || `Auth failed: ${response.status}`
        );
      }

      if (!data?.access_token) {
        throw new Error("No access_token in response");
      }

      localStorage.setItem("access_token", data.access_token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user ?? null);

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

  // Получаем профиль с бэка по токену
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

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
        const payload = await response.json();
        // payload может быть { user: {...} } или напрямую user
        const user = payload.user ?? payload;
        setUserInfo(user);
        return user;
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUserInfo(null);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
    return null;
  };

  // Основной эффект: реагируем на webApp и занимаемся авторизацией/заполнением UI
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

    // Если есть подписанное initData — пробуем серверную аутентификацию
    if (!authAttemptedRef.current) {
      authAttemptedRef.current = true;
      if (initData && initData.trim() !== "") {
        authenticateWithTelegram(initData).catch((e) => {
          console.warn("authenticateWithTelegram failed:", e);
          // если не удалось — попробуем по токену (если есть)
          if (localStorage.getItem("access_token")) fetchCurrentUser();
        });
      } else if (localStorage.getItem("access_token")) {
        // нет подписанного initData, но есть токен — используем его
        fetchCurrentUser();
      } else if (unsafe?.user) {
        // никакого токена и подписанного initData нет — используем unsafe.user для UI (но НЕ для аутентификации)
        setUserInfo(unsafe.user);
      }
    }
  }, [webApp]);

  // Настройка MainButton (надёжно) + fallback Close button
  useEffect(() => {
    if (!webApp) return;

    const btn = webApp.MainButton;
    if (btn) {
      try {
        if (typeof btn.setText === "function") btn.setText("Close");
        if (typeof btn.show === "function") btn.show();

        const handler = () => {
          try {
            if (typeof webApp.close === "function") webApp.close();
          } catch (e) {
            console.warn("webApp.close() failed:", e);
          }
        };

        mainBtnHandlerRef.current = handler;

        if (typeof btn.onClick === "function") {
          // onClick может вернуть функцию отписки, но необязательно
          const maybeOff = btn.onClick(handler);
          return () => {
            try {
              if (typeof maybeOff === "function") {
                maybeOff();
              } else if (typeof btn.offClick === "function") {
                btn.offClick(handler);
              }
            } catch (e) {
              console.warn("MainButton cleanup failed:", e);
            }
          };
        } else if (typeof btn.addEventListener === "function") {
          btn.addEventListener("click", handler);
          return () => {
            try {
              btn.removeEventListener("click", handler);
            } catch (e) {
              console.warn("MainButton removeEventListener failed:", e);
            }
          };
        }
      } catch (e) {
        console.warn("Failed to setup MainButton:", e);
      }
    }
    // если нет btn — нет cleanup
    return undefined;
  }, [webApp]);

  // Попытка "связать" аккаунт через sendData (если доступно) или deep link
  const linkAccount = async () => {
    try {
      const unsafeId = webApp?.initDataUnsafe?.user?.id;
      // Если доступен sendData — вызываем его, бот получит service message
      if (webApp && typeof webApp.sendData === "function") {
        webApp.sendData(JSON.stringify({ action: "request_link" }));
        // Здесь ожидаем, что бот + бэк привяжут chat_id -> token. Можно реализовать polling.
        // Пока отображаем сообщение пользователю.
        alert(
          "Запрос отправлен боту. Проверьте чат с ботом — он завершит привязку."
        );
        return;
      }
      // fallback: открываем deep link на бота (передаём параметр, если есть)
      const botUrl = `https://t.me/YourBot${
        unsafeId ? `?start=link_${unsafeId}` : ""
      }`;
      window.open(botUrl, "_blank");
    } catch (e) {
      console.warn("linkAccount failed:", e);
      alert(
        "Не удалось автоматически связать аккаунт. Попробуйте открыть бота вручную."
      );
    }
  };

  const handleManualAuth = () => {
    if (webApp?.initData) {
      authenticateWithTelegram(webApp.initData).catch((e) => {
        console.error("Manual auth failed:", e);
      });
    } else {
      setError(
        "No init data available. Use 'Link account' to connect via bot."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUserInfo(null);
    setError(null);
  };

  // Определяем, нужно ли показывать фоллбэк-кнопку Close (если MainButton отсутствует/скрыт)
  const showFallbackClose =
    webApp &&
    (!webApp.MainButton ||
      (typeof webApp.MainButton.isVisible === "function"
        ? !webApp.MainButton.isVisible()
        : webApp.MainButton.isVisible === false));

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <header
        style={{
          paddingBottom: 16,
          borderBottom: "1px solid #e0e0e0",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", color: "#333", fontSize: 24 }}>
          AllTransfer Mini App
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          Telegram WebApp {webApp ? "✅ connected" : "❌ not connected"}
        </p>
      </header>

      <section style={{ marginBottom: 16 }}>
        {loading && (
          <div
            style={{
              padding: 12,
              backgroundColor: "#e3f2fd",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <p style={{ margin: 0, color: "#1976d2" }}>🔄 Authenticating...</p>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: 12,
              backgroundColor: "#ffebee",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#d32f2f",
                fontWeight: "bold",
              }}
            >
              ❌ Authentication Error
            </p>
            <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#d32f2f" }}>
              {error}
            </p>
            <button
              onClick={handleManualAuth}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#0088cc",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              🔄 Retry Authentication
            </button>
          </div>
        )}

        {!userInfo && !loading && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ margin: 0, color: "#666" }}>
              В мобильном/десктоп клиенте может не приходить подписанный
              initData. Для корректной привязки аккаунта:
            </p>
            <ul style={{ marginTop: 8, color: "#333" }}>
              <li>
                Нажмите «Link account» — бот получит ваш профиль и привяжет
                токен.
              </li>
              <li>
                Или, если у вас уже был токен — приложение автоматически
                попытается загрузить профиль.
              </li>
            </ul>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={linkAccount}
                style={{
                  padding: "8px 12px",
                  fontSize: 14,
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                🔗 Link account
              </button>

              <button
                onClick={handleManualAuth}
                style={{
                  padding: "8px 12px",
                  fontSize: 14,
                  backgroundColor: "#00897b",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                🔄 Try server auth
              </button>
            </div>
          </div>
        )}

        {userInfo && (
          <div
            style={{
              padding: 12,
              backgroundColor: "#e8f5e9",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                margin: "0 0 12px 0",
                color: "#2e7d32",
                fontWeight: "bold",
              }}
            >
              ✅ Authenticated{" "}
              {webApp?.initData ? "(via initData)" : "(via token / unsafe)"}
            </p>

            <div style={{ fontSize: 14 }}>
              <p style={{ margin: "4px 0" }}>
                <strong>ID:</strong> {userInfo.id}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Name:</strong> {userInfo.first_name}{" "}
                {userInfo.last_name || ""}
              </p>
              {userInfo.username && (
                <p style={{ margin: "4px 0" }}>
                  <strong>Username:</strong> @{userInfo.username}
                </p>
              )}
              <p style={{ margin: "4px 0" }}>
                <strong>Role:</strong> {userInfo.role || "—"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Telegram ID:</strong>{" "}
                {userInfo.telegram_id || userInfo.id}
              </p>
              {(!webApp?.initData || !webApp.initData) && (
                <p style={{ marginTop: 8, color: "#b71c1c", fontSize: 12 }}>
                  ⚠️ Данные получены из initDataUnsafe / токена — они не
                  подписаны.
                </p>
              )}
            </div>

            <button
              onClick={handleLogout}
              style={{
                marginTop: 8,
                padding: "6px 12px",
                fontSize: 12,
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </section>

      <section>
        <details>
          <summary
            style={{
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "bold",
              color: "#666",
              padding: "8px 0",
            }}
          >
            🔍 Debug Information
          </summary>

          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: 12,
              borderRadius: 6,
              marginTop: 8,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0" }}>WebApp Status:</h4>
            <pre style={{ margin: "4px 0" }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>

            {webApp?.initData && (
              <>
                <h4 style={{ margin: "16px 0 8px 0" }}>Parsed Init Data:</h4>
                <pre style={{ margin: "4px 0" }}>
                  {JSON.stringify(parseInitData(webApp.initData), null, 2)}
                </pre>
              </>
            )}

            {localStorage.getItem("access_token") && (
              <>
                <h4 style={{ margin: "16px 0 8px 0" }}>
                  Access Token (preview):
                </h4>
                <p style={{ wordBreak: "break-all", margin: "4px 0" }}>
                  {localStorage.getItem("access_token").substring(0, 50)}...
                </p>
              </>
            )}
          </div>
        </details>
      </section>

      {/* fallback Close button (если MainButton не отображается) */}
      {showFallbackClose && webApp && (
        <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }}>
          <button
            onClick={() => {
              try {
                if (typeof webApp.close === "function") webApp.close();
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
    </div>
  );
};

export default TelegramAuth;
