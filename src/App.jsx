import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Header from "./components/Header/Header";
import "./App.css";
import { init, retrieveLaunchParams } from '@telegram-apps/sdk-react';

function TelegramApp() {
  useEffect(() => {
    // Инициализируем SDK
    init();
    
    // Получаем параметры запуска
    const launchParams = retrieveLaunchParams();
    console.log('Launch params:', launchParams);
    
    // Дополнительные настройки
    // ...
  }, []);

  return (
    <div>
      <h1>Мое Telegram Mini App</h1>
      {/* Ваш контент */}
    </div>
  );
}

export default TelegramApp;
