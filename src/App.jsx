import React, { useEffect } from "react";
import { WebApp } from "@twa-dev/sdk";
import "./App.css";

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp
    WebApp.ready();

    // Расширяем приложение на весь экран
    WebApp.expand();

    // Устанавливаем цвет фона
    WebApp.setBackgroundColor("#000000");
  }, []);

  const handleButtonClick = () => {
    // Пример использования Telegram WebApp API
    WebApp.showAlert("Hello from Telegram Mini App!");

    // Отправка данных обратно в бота
    WebApp.sendData("Some data to bot");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Telegram Mini App</h1>
        <p>Welcome to your React Telegram app!</p>

        <button onClick={handleButtonClick} className="telegram-button">
          Click me!
        </button>

        <div className="user-info">
          <p>User: {WebApp.initDataUnsafe.user?.first_name}</p>
          <p>Platform: {WebApp.platform}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
