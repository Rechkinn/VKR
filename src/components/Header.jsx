import React, { useEffect, useState } from "react";
import useTelegramWebApp from "../hooks/useTelegramWebApp";

export default function Header() {
  const { webapp, ready } = useTelegramWebApp();
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Функция для отправки данных на бэкенд
  const sendAuthDataToBackend = async (initData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: initData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Auth successful:', data);
      
      // Сохраняем информацию о пользователе
      setUserInfo(data.user);
      
      // Сохраняем токен (можно в localStorage или в состоянии приложения)
      localStorage.setItem('access_token', data.access_token);
      
      return data;
    } catch (err) {
      console.error('Auth failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция для парсинга initData и отображения
  const parseInitData = (initData) => {
    if (!initData) return null;
    
    try {
      const params = new URLSearchParams(initData);
      const parsedData = {};
      
      for (const [key, value] of params) {
        if (key === 'user') {
          try {
            parsedData[key] = JSON.parse(value);
          } catch {
            parsedData[key] = value;
          }
        } else {
          parsedData[key] = value;
        }
      }
      
      return parsedData;
    } catch (err) {
      console.error('Error parsing initData:', err);
      return { raw: initData };
    }
  };

  useEffect(() => {
    if (!ready || !webapp) return;

    // Настраиваем внешний вид
    try {
      if (webapp.setHeaderColor) webapp.setHeaderColor("#0088cc");
    } catch (e) {
      console.warn('Failed to set header color:', e);
    }

    // Получаем initData от Telegram WebApp
    const initData = webapp.initData || webapp.initDataUnsafe;
    console.log('Telegram WebApp initData:', initData);

    // Парсим и сохраняем initData для отображения
    if (initData) {
      const parsedData = parseInitData(initData);
      setAuthData(parsedData);
      
      // Автоматически отправляем данные на бэкенд для аутентификации
      sendAuthDataToBackend(initData).catch(err => {
        console.error('Auto-auth failed:', err);
      });
    }

    // Настраиваем кнопку
    if (webapp.MainButton && webapp.MainButton.setText) {
      webapp.MainButton.setText("Done");
      webapp.MainButton.show && webapp.MainButton.show();
    }

    const onMain = () => {
      if (webapp.sendData) {
        webapp.close();
      } else {
        console.log("Main clicked");
      }
    };

    webapp.MainButton &&
      webapp.MainButton.onClick &&
      webapp.MainButton.onClick(onMain);

    return () => {
      webapp.MainButton &&
        webapp.MainButton.offClick &&
        webapp.MainButton.offClick(onMain);
    };
  }, [ready, webapp]);

  // Функция для ручной повторной отправки данных
  const handleRetryAuth = () => {
    if (webapp?.initData) {
      sendAuthDataToBackend(webapp.initData);
    }
  };

  return (
    <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
      <h1>My TG Mini App (React)</h1>
      <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
        Telegram.WebApp {ready ? "connected" : "not connected"}
      </p>

      {/* Статус аутентификации */}
      <div style={{ marginTop: 12 }}>
        {loading && <p style={{ color: '#666' }}>🔄 Authenticating...</p>}
        {error && (
          <div style={{ color: 'red' }}>
            <p>❌ Auth error: {error}</p>
            <button 
              onClick={handleRetryAuth}
              style={{ 
                padding: '4px 8px', 
                fontSize: 12,
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: 4
              }}
            >
              Retry
            </button>
          </div>
        )}
        {userInfo && (
          <p style={{ color: 'green' }}>✅ Authenticated as: {userInfo.username || userInfo.first_name}</p>
        )}
      </div>

      {/* Отображение initData */}
      {authData && (
        <div style={{ marginTop: 16, fontSize: 12 }}>
          <h3 style={{ margin: '8px 0', fontSize: 14 }}>Telegram Init Data:</h3>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 8, 
            borderRadius: 4,
            maxHeight: 200,
            overflow: 'auto',
            fontFamily: 'monospace'
          }}>
            <pre>{JSON.stringify(authData, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Информация о пользователе из бэкенда */}
      {userInfo && (
        <div style={{ marginTop: 16, fontSize: 12 }}>
          <h3 style={{ margin: '8px 0', fontSize: 14 }}>User from Backend:</h3>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: 8, 
            borderRadius: 4,
            fontFamily: 'monospace'
          }}>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          </div>
        </div>
      )}
    </header>
  );
}
