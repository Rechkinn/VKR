import { useEffect, useState } from 'react';

const TelegramAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegramApp = () => {
      try {
        // Проверяем доступность Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Инициализируем приложение
          tg.ready();
          tg.expand(); // Раскрываем на весь экран
          
          // Парсим данные пользователя
          const userData = tg.initDataUnsafe?.user;
          
          if (userData) {
            setUser({
              id: userData.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              username: userData.username,
              languageCode: userData.language_code,
              isPremium: userData.is_premium || false
            });
          } else {
            setError('Данные пользователя не получены');
          }
          
          setLoading(false);
        } else {
          setError('Telegram WebApp не доступен');
          setLoading(false);
        }
      } catch (err) {
        setError(`Ошибка инициализации: ${err.message}`);
        setLoading(false);
      }
    };

    // Добавляем скрипт Telegram WebApp если его нет
    if (!window.Telegram) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.onload = initTelegramApp;
      script.onerror = () => {
        setError('Не удалось загрузить Telegram WebApp');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initTelegramApp();
    }
  }, []);

  if (loading) {
    return <div>Загрузка Telegram Mini App...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h2>Данные пользователя Telegram</h2>
      {user && (
        <div>
          <p>ID: {user.id}</p>
          <p>Имя: {user.firstName} {user.lastName}</p>
          <p>Username: @{user.username}</p>
          <p>Язык: {user.languageCode}</p>
          <p>Premium: {user.isPremium ? 'Да' : 'Нет'}</p>
        </div>
      )}
    </div>
  );
};

export default TelegramAuth;
