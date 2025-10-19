import { useEffect, useState } from "react";

const TelegramMiniAppInitializer = () => {
  const [initData, setInitData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeTelegramApp = () => {
      try {
        // Проверяем, доступен ли объект Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp;

          // Инициализируем приложение
          tg.ready();

          // Получаем данные разными способами для надежности
          const initDataUnsafe = tg.initDataUnsafe;
          const initDataString = tg.initData;

          console.log("Telegram WebApp объект доступен:", tg);
          console.log("initDataUnsafe:", initDataUnsafe);
          console.log("initData строка:", initDataString);

          const result = {
            // Основные данные пользователя
            user: initDataUnsafe?.user || null,

            // Полная initData строка (для серверной проверки)
            initData: initDataString,

            // Дополнительная информация
            platform: tg.platform,
            version: tg.version,
            themeParams: tg.themeParams,
            colorScheme: tg.colorScheme,

            // Информация о чате
            chat: initDataUnsafe?.chat || null,

            // Время авторизации
            authDate: initDataUnsafe?.auth_date || null,

            // Хэш для проверки
            hash: initDataUnsafe?.hash || null,
          };

          setInitData(result);
          setIsLoading(false);
        } else {
          setError(
            "Telegram WebApp объект не найден. Приложение запущено вне Telegram?"
          );
          setIsLoading(false);
        }
      } catch (err) {
        setError(`Ошибка инициализации: ${err.message}`);
        setIsLoading(false);
      }
    };

    // Задержка для гарантии загрузки Telegram WebApp скрипта
    if (window.Telegram && window.Telegram.WebApp) {
      initializeTelegramApp();
    } else {
      // Если скрипт еще не загружен, ждем немного и пробуем снова
      const timer = setTimeout(() => {
        initializeTelegramApp();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Функция для красивого вывода JSON
  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  if (isLoading) {
    return (
      <div>
        <h2>Инициализация Telegram Mini App...</h2>
        <p>Пожалуйста, подождите</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Ошибка инициализации</h2>
        <p style={{ color: "red" }}>{error}</p>
        <div>
          <h3>Отладочная информация:</h3>
          <pre>
            {`
User Agent: ${navigator.userAgent}
Telegram объект: ${window.Telegram ? "доступен" : "не доступен"}
WebApp объект: ${window.Telegram?.WebApp ? "доступен" : "не доступен"}
URL: ${window.location.href}
            `}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Данные Telegram Mini App</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Статус:</h3>
        <p>
          Платформа: <strong>{initData.platform}</strong>
        </p>
        <p>
          Версия WebApp: <strong>{initData.version}</strong>
        </p>
        <p>
          Цветовая схема: <strong>{initData.colorScheme}</strong>
        </p>
      </div>

      {initData.user ? (
        <div style={{ marginBottom: "20px" }}>
          <h3>Данные пользователя:</h3>
          <ul>
            <li>
              <strong>ID:</strong> {initData.user.id}
            </li>
            <li>
              <strong>Имя:</strong> {initData.user.first_name}
            </li>
            <li>
              <strong>Фамилия:</strong>{" "}
              {initData.user.last_name || "не указана"}
            </li>
            <li>
              <strong>Username:</strong> {initData.user.username || "не указан"}
            </li>
            <li>
              <strong>Язык:</strong>{" "}
              {initData.user.language_code || "не указан"}
            </li>
            <li>
              <strong>Дата авторизации:</strong>{" "}
              {newDate(initData.authDate * 1000).toLocaleString()}
            </li>
          </ul>
        </div>
      ) : (
        <div style={{ marginBottom: "20px", color: "orange" }}>
          <h3> Данные пользователя не доступны</h3>
          <p>Это может быть связано с:</p>
          <ul>
            <li>Запуском вне Telegram</li>
            <li>Старой версией Telegram клиента</li>
            <li>Настройками приватности пользователя</li>
            <li>Типом кнопки, через которую открыто приложение</li>
          </ul>
        </div>
      )}

      {initData.chat && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Данные чата:</h3>
          <pre>{formatJSON(initData.chat)}</pre>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h3>Параметры темы:</h3>
        <pre>{formatJSON(initData.themeParams)}</pre>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Полная initData строка:</h3>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "5px",
            overflow: "auto",
            maxHeight: "200px",
          }}
        >
          {initData.initData || "не доступна"}
        </pre>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Все данные в JSON:</h3>
        <pre
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            overflow: "auto",
            maxHeight: "300px",
          }}
        >
          {formatJSON(initData)}
        </pre>
      </div>
    </div>
  );
};

export default TelegramMiniAppInitializer;
