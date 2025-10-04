import React, { useState, useEffect } from "react";
import Profile from "./profile/profile";

const TelegramAuth = () => {
  const [webApp, setWebApp] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);

      // Инициализируем WebApp
      tgWebApp.ready();
      tgWebApp.expand();

      // Настраиваем внешний вид
      tgWebApp.setHeaderColor("#0088cc");
      tgWebApp.setBackgroundColor("#ffffff");

      console.log("Telegram WebApp initialized:", tgWebApp);
      console.log("Init Data:", tgWebApp.initData);
      console.log("Init Data Unsafe:", tgWebApp.initDataUnsafe);
    } else {
      console.warn(
        "Telegram WebApp not available - running in development mode"
      );
      setError("Telegram WebApp not detected. Please open in Telegram.");
    }
  }, []);

  // Функция для отправки данных аутентификации
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Authentication failed: ${response.status}`
        );
      }

      const data = await response.json();

      // Сохраняем данные
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo(data.user);

      console.log("✅ Authentication successful:", data);
      return data;
    } catch (err) {
      console.error("❌ Authentication failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения информации о текущем пользователе
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
      } else if (response.status === 401) {
        // Токен невалидный, удаляем его
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // Основной эффект для аутентификации
  useEffect(() => {
    if (!webApp) return;

    const initData = webApp.initData;

    // Собираем отладочную информацию
    setDebugInfo({
      initDataAvailable: !!initData,
      initDataLength: initData?.length || 0,
      initDataUnsafe: webApp.initDataUnsafe,
      hasToken: !!localStorage.getItem("access_token"),
    });

    // Если есть initData, пробуем аутентифицироваться
    if (initData && initData.trim() !== "") {
      authenticateWithTelegram(initData).catch(console.error);
    } else if (localStorage.getItem("access_token")) {
      // Если нет initData, но есть токен - получаем информацию о пользователе
      fetchCurrentUser();
    }
  }, [webApp]);

  // Функция для ручного запуска аутентификации
  const handleManualAuth = () => {
    if (webApp?.initData) {
      authenticateWithTelegram(webApp.initData);
    } else {
      setError("No init data available. Please open in Telegram.");
    }
  };

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUserInfo(null);
    setError(null);
  };

  // Функция для парсинга initData для отображения
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

  // Настройка кнопки закрытия
  useEffect(() => {
    if (!webApp || !webApp.MainButton || !userInfo) return;

    try {
      webApp.MainButton.setText("Close");
      webApp.MainButton.show();

      const handleClose = () => {
        webApp.close();
      };

      webApp.MainButton.onClick(handleClose);

      return () => {
        webApp.MainButton.offClick(handleClose);
      };
    } catch (e) {
      console.warn("Failed to setup MainButton:", e);
    }
  }, [webApp, userInfo]);

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
        <h1
          style={{
            margin: "0 0 8px 0",
            color: "#333",
            fontSize: 24,
          }}
        >
          AllTransfer Mini App
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#666",
          }}
        >
          Telegram WebApp {webApp ? "✅ connected" : "❌ not connected"}
        </p>
      </header>

      {/* Статус аутентификации */}
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
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: 14,
                color: "#d32f2f",
              }}
            >
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

        {userInfo && (
          <>
            <section>
              <Profile />
            </section>

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
                ✅ Authenticated
              </p>
              <div>
                {/* <div>---------</div>
                <div>{userInfo}</div>
                <div>---------</div> */}
              </div>
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
                  <strong>Role:</strong> {userInfo.role}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>Telegram ID:</strong> {userInfo.telegram_id}
                </p>
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
          </>
        )}
      </section>

      {/* Отладочная информация */}
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
                <h4 style={{ margin: "16px 0 8px 0" }}>Access Token:</h4>
                <p
                  style={{
                    wordBreak: "break-all",
                    margin: "4px 0",
                  }}
                >
                  {localStorage.getItem("access_token").substring(0, 50)}...
                </p>
              </>
            )}

            <div>---</div>
            <div>{userInfo}</div>
            <div>---</div>
          </div>
        </details>
      </section>
    </div>
  );
};

export default TelegramAuth;
