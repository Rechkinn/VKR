import { useEffect, useState } from "react";

const SimpleTelegramInit = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверяем доступность Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Инициализируем приложение
      tg.ready();

      // Получаем данные пользователя
      const userData = tg.initDataUnsafe?.user;
      setUser(userData);

      console.log("Telegram User:", userData);
    }
  }, []);

  return (
    <div>
      <h2>Telegram Mini App Data</h2>

      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Данные пользователя не загружены</p>
      )}
    </div>
  );
};

export default SimpleTelegramInit;
