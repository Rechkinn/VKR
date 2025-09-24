import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header/Header";
import { SDKProvider, useLaunchParams, useMiniApp } from "@telegram-apps/sdk-react";

// Основной компонент приложения
function TelegramApp() {
  const [count, setCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const miniApp = useMiniApp();
  const launchParams = useLaunchParams();

  // Инициализация Telegram Mini App
  useEffect(() => {
    async function initTelegram() {
      try {
        // Инициализируем Mini App
        await miniApp.ready();
        
        // Получаем данные пользователя
        const user = launchParams.initData?.user;
        if (user) {
          setUserData({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
          });
        }

        // Меняем цвет фона приложения
        miniApp.setBackgroundColor('#1a1a1a');
        
      } catch (error) {
        console.error('Error initializing Telegram Mini App:', error);
      }
    }

    initTelegram();
  }, [miniApp, launchParams]);

  // Функция для показа alert в Telegram
  const showAlert = async () => {
    try {
      miniApp.showAlert(`Текущий счет: ${count}`);
    } catch (error) {
      alert(`Текущий счет: ${count}`); // fallback
    }
  };

  // Функция для закрытия приложения
  const closeApp = () => {
    miniApp.close();
  };

  return (
    <div className="telegram-app">
      {/* Шапка с информацией о пользователе */}
      {userData && (
        <div className="user-info">
          <h3>Добро пожаловать, {userData.firstName}!</h3>
          <p>@{userData.username || 'без username'}</p>
        </div>
      )}

      {/* Основной контент */}
      <div className="app-content">
        <h1>✨ Мое Telegram Mini App</h1>
        
        <div className="counter-section">
          <h2>Счетчик: {count}</h2>
          <div className="buttons">
            <button 
              className="tg-button"
              onClick={() => setCount(count + 1)}
            >
              +1
            </button>
            <button 
              className="tg-button"
              onClick={() => setCount(count - 1)}
            >
              -1
            </button>
            <button 
              className="tg-button secondary"
              onClick={() => setCount(0)}
            >
              Сбросить
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="tg-button primary" onClick={showAlert}>
            Показать счет
          </button>
          <button className="tg-button danger" onClick={closeApp}>
            Закрыть приложение
          </button>
        </div>

        {/* Информация о запуске */}
        <div className="debug-info">
          <details>
            <summary>Информация о запуске</summary>
            <pre>{JSON.stringify(launchParams, null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}

// Обертка провайдера
function App() {
  return (
    <SDKProvider>
      <TelegramApp />
    </SDKProvider>
  );
}

export default App;
