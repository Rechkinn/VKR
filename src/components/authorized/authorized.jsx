import { useEffect, useState } from 'react';
import { WebApp, init } from '@twa-dev/sdk';

const TelegramInit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Инициализируем Telegram Mini App
        await init();
        
        // Говорим Telegram что приложение готово
        WebApp.ready();
        WebApp.expand();
        
        // Получаем данные пользователя
        const userData = WebApp.initDataUnsafe?.user;
        
        if (userData) {
          setUser({
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name, 
            username: userData.username
          });
        }
        
        setLoading(false);
        
      } catch (error) {
        console.log('Ошибка инициализации:', error);
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h3>Загрузка Telegram Mini App...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <div>
          <h2>✅ Приложение инициализировано!</h2>
          <div style={{ 
            padding: 15, 
            background: '#e8f5e8', 
            borderRadius: 8, 
            marginTop: 15 
          }}>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Имя:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Username:</strong> @{user.username}</p>
          </div>
        </div>
      ) : (
        <div>
          <h2>❌ Данные не получены</h2>
          <p>Откройте приложение через Telegram бота</p>
        </div>
      )}
    </div>
  );
};

export default TelegramInit;
