import { useEffect, useState } from "react";

const TelegramInit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegramApp = async () => {
      try {
        // Проверяем доступность Telegram WebApp
        if (!window.Telegram?.WebApp) {
          setError("Telegram WebApp не доступен");
          setLoading(false);
          return;
        }

        const tg = window.Telegram.WebApp;
        tg.ready();

        // Определяем iOS
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS) {
          // Для iOS: ждем данные с таймаутом
          await waitForIOSData(tg);
        } else {
          // Для других платформ: берем сразу
          const userData = tg.initDataUnsafe?.user;
          if (userData?.id) {
            setUser(userData);
          } else {
            setError("Данные пользователя не загружены");
          }
          setLoading(false);
        }
      } catch (err) {
        setError(`Ошибка: ${err.message}`);
        setLoading(false);
      }
    };

    const waitForIOSData = async (tg) => {
      const maxWaitTime = 10000; // 10 секунд максимум
      const startTime = Date.now();

      while (Date.now() - startTime < maxWaitTime) {
        const userData = tg.initDataUnsafe?.user;

        if (userData?.id) {
          setUser(userData);
          setLoading(false);
          return;
        }

        // Ждем 500ms перед следующей проверкой
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Если время вышло
      const finalData = tg.initDataUnsafe?.user;
      if (finalData?.id) {
        setUser(finalData);
      } else {
        setError("Не удалось загрузить данные на iOS");
      }
      setLoading(false);
    };

    initTelegramApp();
  }, []);

  if (loading) {
    return (
      <div>
        <h3>Загрузка данных Telegram...</h3>
        <p>Пожалуйста, подождите</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3>Ошибка</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Данные пользователя загружены:</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default TelegramInit;
