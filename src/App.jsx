import { useEffect, useState } from "react";
import { 
  retrieveLaunchParams, 
  miniApp, 
  initData, 
  $debug,
  init as initSDK
} from '@telegram-apps/sdk-react';
import Header from "./components/Header/Header";
import "./App.css";

function TelegramApp() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Включаем отладку для разработки
        $debug.enabled = true;

        // Инициализируем SDK
        initSDK();
        
        // Получаем параметры запуска
        const launchParams = retrieveLaunchParams();
        console.log('Launch params:', launchParams);
        
        // Инициализируем miniApp
        if (miniApp.isSupported()) {
          miniApp.mount();
          miniApp.ready();
        }

        let userData = null;

        // Способ 1: Через initData (новый API)
        if (initData.isSupported()) {
          try {
            await initData.restore();
            const user = initData.user();
            if (user) {
              userData = user;
              console.log('User data from initData:', userData);
            }
          } catch (initDataError) {
            console.warn('Error getting initData:', initDataError);
          }
        }

        // Способ 2: Через launchParams (если initData не работает)
        if (!userData && launchParams.initData?.user) {
          userData = launchParams.initData.user;
          console.log('User data from launchParams:', userData);
        }

        // Способ 3: Альтернативный через window.Telegram (для совместимости)
        if (!userData && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          userData = tg.initDataUnsafe?.user;
          console.log('User data from Telegram.WebApp:', userData);
        }

        // Если нашли данные пользователя
        if (userData) {
          const profile = {
            id: userData.id,
            firstName: userData.firstName || userData.first_name,
            lastName: userData.lastName || userData.last_name,
            username: userData.username,
            photoUrl: userData.photoUrl || userData.photo_url,
            languageCode: userData.languageCode || userData.language_code,
            isPremium: userData.isPremium || userData.is_premium || false,
          };
          setUserProfile(profile);
          console.log('User profile set:', profile);
        } else {
          console.warn('No user data found');
          // В режиме разработки можем использовать моковые данные
          if (process.env.NODE_ENV === 'development') {
            setUserProfile({
              id: 123456789,
              firstName: 'Test',
              lastName: 'User',
              username: 'testuser',
              languageCode: 'en',
              isPremium: false
            });
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(`Failed to initialize application: ${err.message}`);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Функция для форматирования ID пользователя
  const formatUserId = (id) => {
    if (!id) return '';
    return id.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Проверяем, запущено ли приложение в Telegram
  const isTelegram = () => {
    return !!(window.Telegram?.WebApp?.initData || 
             window.Telegram?.WebApp?.initDataUnsafe ||
             retrieveLaunchParams()?.initData);
  };

  if (loading) {
    return (
      <div className="telegram-app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telegram-app">
        <div className="error">
          <h3>Ошибка</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="telegram-app">
      <Header />
      
      <main className="main-content">
        <h1>Мой Telegram Mini App</h1>
        
        {userProfile ? (
          <div className="user-profile">
            <div className="profile-header">
              <h2>Профиль пользователя</h2>
              {userProfile.isPremium && (
                <span className="premium-badge">⭐ Premium</span>
              )}
            </div>
            
            <div className="profile-content">
              {/* Аватар пользователя */}
              {userProfile.photoUrl ? (
                <div className="avatar-section">
                  <img 
                    src={userProfile.photoUrl} 
                    alt="User Avatar" 
                    className="user-avatar"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="avatar-placeholder" style={{display: 'none'}}>
                    <span>
                      {userProfile.firstName ? userProfile.firstName[0] : ''}
                      {userProfile.lastName ? userProfile.lastName[0] : ''}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="avatar-placeholder">
                  <span>
                    {userProfile.firstName ? userProfile.firstName[0] : ''}
                    {userProfile.lastName ? userProfile.lastName[0] : ''}
                  </span>
                </div>
              )}
              
              {/* Информация о пользователе */}
              <div className="user-info">
                <div className="info-item">
                  <label>ID пользователя:</label>
                  <span className="user-id">{formatUserId(userProfile.id)}</span>
                </div>
                
                <div className="info-item">
                  <label>Имя:</label>
                  <span>{userProfile.firstName || 'Не указано'}</span>
                </div>
                
                {userProfile.lastName && (
                  <div className="info-item">
                    <label>Фамилия:</label>
                    <span>{userProfile.lastName}</span>
                  </div>
                )}
                
                {userProfile.username && (
                  <div className="info-item">
                    <label>Username:</label>
                    <span>@{userProfile.username}</span>
                  </div>
                )}
                
                {userProfile.languageCode && (
                  <div className="info-item">
                    <label>Язык:</label>
                    <span>{userProfile.languageCode.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-user-data">
            <div className="no-data-icon">📱</div>
            <h3>Данные пользователя не доступны</h3>
            <p>Откройте приложение через Telegram для получения данных пользователя</p>
            {!isTelegram() && (
              <div className="warning">
                <span>⚠️</span>
                <p>Приложение запущено вне Telegram WebApp</p>
              </div>
            )}
          </div>
        )}
        
        <div className="app-info">
          <h3>Информация о приложении</h3>
          <p>Демонстрация Telegram Mini App с использованием @telegram-apps/sdk-react 3.0.0</p>
          <div className="tech-info">
            <span>SDK версия: 3.0.0</span>
            <span>Статус Telegram: {isTelegram() ? '✅ Подключен' : '❌ Не подключен'}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TelegramApp;
