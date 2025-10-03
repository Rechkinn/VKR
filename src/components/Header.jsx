import React, { useEffect, useState } from "react";
import useTelegramWebApp from "../hooks/useTelegramWebApp";

export default function Header() {
  const { webapp, ready } = useTelegramWebApp();
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Функция для отправки данных на бэкенд
  const sendAuthDataToBackend = async (initDataString) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending initData to backend:', initDataString);
      
      const response = await fetch('https://xn--80aqak6ae.xn--p1ai/api/v1/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: initDataString  // ВАЖНО: отправляем СТРОКУ, а не объект
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Auth successful:', data);
      
      // Сохраняем информацию о пользователе
      setUserInfo(data.user);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (err) {
      console.error('❌ Auth failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция для парсинга initData для отображения
  const parseInitDataForDisplay = (initDataString) => {
    if (!initDataString) return null;
    
    try {
      const params = new URLSearchParams(initDataString);
      const parsedData = {};
      
      for (const [key, value] of params) {
        if (key === 'user') {
          try {
            parsedData[key] = JSON.parse(decodeURIComponent(value));
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
      return { raw: initDataString };
    }
  };

  useEffect(() => {
    if (!ready || !webapp) return;

    console.log('Telegram WebApp ready:', webapp);

    // Настраиваем внешний вид
    try {
      if (webapp.setHeaderColor) {
        webapp.setHeaderColor("#0088cc");
      }
      if (webapp.setBackgroundColor) {
        webapp.setBackgroundColor("#ffffff");
      }
    } catch (e) {
      console.warn('Failed to set colors:', e);
    }

    // ВАЖНО: получаем initData как СТРОКУ
    const initDataString = webapp.initData;
    
    console.log('initData type:', typeof initDataString);
    console.log('initData value:', initDataString);
    console.log('initDataUnsafe:', webapp.initDataUnsafe);

    // Проверяем что initData это строка и не пустая
    if (!initDataString || typeof initDataString !== 'string' || initDataString.trim() === '') {
      console.warn('⚠️ initData is empty or invalid. This might be a development environment.');
      console.log('Available data:', {
        initData: initDataString,
        initDataUnsafe: webapp.initDataUnsafe,
        user: webapp.initDataUnsafe?.user
      });
      
      // В режиме разработки можем показать данные из initDataUnsafe
      if (webapp.initDataUnsafe?.user) {
        setAuthData({
          isDevelopment: true,
          user: webapp.initDataUnsafe.user
        });
        setError('Development mode: initData not available. Use test-login endpoint.');
      }
      return;
    }

    // Парсим для отображения
    const parsedData = parseInitDataForDisplay(initDataString);
    setAuthData(parsedData);
    
    // Отправляем на бэкенд
    sendAuthDataToBackend(initDataString).catch(err => {
      console.error('Auto-auth failed:', err);
    });

    // Настраиваем кнопку
    if (webapp.MainButton) {
      try {
        webapp.MainButton.setText("Close");
        webapp.MainButton.show();
        
        const onMainButtonClick = () => {
          console.log("Main button clicked");
          webapp.close();
        };
        
        webapp.MainButton.onClick(onMainButtonClick);
        
        return () => {
          webapp.MainButton.offClick(onMainButtonClick);
        };
      } catch (e) {
        console.warn('Failed to setup MainButton:', e);
      }
    }
  }, [ready, webapp]);

  // Функция для ручной повторной отправки
  const handleRetryAuth = () => {
    const initDataString = webapp?.initData;
    if (initDataString && typeof initDataString === 'string' && initDataString.trim() !== '') {
      sendAuthDataToBackend(initDataString);
    } else {
      setError('initData not available. Cannot retry authentication.');
    }
  };

  // Функция для тестового входа (только для разработки)
  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const testTelegramId = Date.now(); // Уникальный ID для теста
      const response = await fetch(
        `https://xn--80aqak6ae.xn--p1ai/api/v1/auth/test-login?telegram_id=${testTelegramId}&first_name=Test&last_name=User&role=passenger`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Test auth successful:', data);
      
      setUserInfo(data.user);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
    } catch (err) {
      console.error('❌ Test auth failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUserInfo(null);
    setAuthData(null);
  };

  return (
    <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
      <h1 style={{ margin: '0 0 8px 0' }}>AllTransfer Mini App</h1>
      <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
        Telegram WebApp {ready ? "✅ connected" : "❌ not connected"}
      </p>

      {/* Статус аутентификации */}
      <div style={{ marginTop: 12 }}>
        {loading && (
          <p style={{ color: '#0088cc', margin: '8px 0' }}>
            🔄 Authenticating...
          </p>
        )}
        
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            backgroundColor: '#ffebee',
            padding: 12,
            borderRadius: 8,
            marginTop: 12
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
              ❌ Authentication Error
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: 12 }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={handleRetryAuth}
                style={{ 
                  padding: '8px 16px', 
                  fontSize: 14,
                  backgroundColor: '#0088cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                🔄 Retry
              </button>
              <button 
                onClick={handleTestLogin}
                style={{ 
                  padding: '8px 16px', 
                  fontSize: 14,
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                🧪 Test Login
              </button>
            </div>
          </div>
        )}
        
        {userInfo && (
          <div style={{ 
            backgroundColor: '#e8f5e9',
            padding: 12,
            borderRadius: 8,
            marginTop: 12
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#2e7d32', fontWeight: 'bold' }}>
              ✅ Authenticated
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              <strong>Name:</strong> {userInfo.first_name} {userInfo.last_name || ''}
            </p>
            {userInfo.username && (
              <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
                <strong>Username:</strong> @{userInfo.username}
              </p>
            )}
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              <strong>Role:</strong> {userInfo.role}
            </p>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '6px 12px', 
                fontSize: 12,
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Отображение initData (для отладки) */}
      {authData && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ 
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#666',
            padding: '4px 0'
          }}>
            🔍 Debug: Telegram Init Data
          </summary>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 12, 
            borderRadius: 6,
            marginTop: 8,
            maxHeight: 300,
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: 11
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(authData, null, 2)}
            </pre>
          </div>
        </details>
      )}

      {/* Сохраненный токен (для отладки) */}
      {localStorage.getItem('access_token') && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ 
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#666',
            padding: '4px 0'
          }}>
            🔑 Debug: Access Token
          </summary>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 12, 
            borderRadius: 6,
            marginTop: 8,
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: 11
          }}>
            {localStorage.getItem('access_token').substring(0, 50)}...
          </div>
        </details>
      )}
    </header>
  );
}
