import { useState, useEffect } from "react";
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

  // const [userData, setUserData] = useState(null);

  const { infoFromTelegram } = useSelector((store) => store.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!webApp) return;

    const unsafe = webApp.initDataUnsafe; // Telegram WebApp предоставляет это
    setDebugInfo({
      initDataAvailable: !!webApp.initData,
      initDataLength: webApp.initData?.length || 0,
      initDataUnsafe: unsafe,
      hasToken: !!localStorage.getItem("access_token"),
    });

    // Если в initDataUnsafe есть user — сохраняем объект пользователя отдельно
    if (unsafe?.user) {
      setTelegramUser(unsafe.user);
    }
    // если нет, можно попробовать распарсить initData и взять user
    else {
      const parsed = parseInitData(webApp.initData);
      if (parsed?.user) setTelegramUser(parsed.user);
    }

    if (telegramUser) parsingUserData(telegramUser);

    // если есть initData — попытка автоаутентификации и т.д.
    if (webApp.initData && webApp.initData.trim() !== "") {
      authenticateWithTelegram(webApp.initData).catch(console.error);
    } else if (localStorage.getItem("access_token")) {
      fetchCurrentUser();
    }
  }, [webApp]);

  function parsingUserData(userData) {
    if (!userData) return <div style={{ color: "#666" }}>No user info</div>;

    let parsed;
    try {
      parsed = typeof userData === "string" ? JSON.parse(userData) : userData;
    } catch (err) {
      return (
        <div style={{ color: "#d32f2f" }}>
          <div>Invalid JSON: {err.message}</div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(userData)}</pre>
        </div>
      );
    }

    if (!parsed || typeof parsed !== "object") {
      return <div>{String(parsed)}</div>;
    }

    // setUserData(parsed);

    dispatch({
      type: SET_USER_TELEGRAM_INFO,
      infoFromTelegram: parsed,
    });
  }

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

      {userInfo && <></>}

      {console.log("telegramUser")}
      {console.log(telegramUser)}
      {telegramUser && (
        <>
          {console.log("infoFromTelegram")}
          {console.log(infoFromTelegram)}
          {infoFromTelegram && (
            <>
              {/* <App userInfo={telegramUser} /> */}
              <App />
            </>
          )}
        </>
      )}
    </>
  );
};

export default TelegramAuth;
