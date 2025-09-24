import { useEffect, useState } from "react";
import { init, retrieveLaunchParams, initData } from '@telegram-apps/sdk-react';
import Header from "./components/Header/Header";
import "./App.css";

function TelegramApp() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инициализируем SDK
        init();
        
        // Получаем параметры запуска
        const launchParams = retrieveLaunchParams();
        console.log('Launch params:', launchParams);
        
        // ПРАВИЛЬНОЕ извлечение данных пользователя
        // Способ 1: Через initDataRaw и парсинг
        let userData = null;
        
        if (launchParams.initData) {
          // Если initData уже объект
          userData = launchParams.initData.user;
        } else if (launchParams.initDataRaw) {
          // Если данные в строковом формате, парсим их
          try {
            const params = new URLSearchParams(launchParams.initDataRaw);
            const userParam = params.get('user');
            if (userParam) {
              userData = JSON.parse(decodeURIComponent(userParam));
            }
          } catch (parseError) {
            console.error('Error parsing initData:', parseError);
          }
        }
        
        // Способ 2: Альтернативный подход через tg WebApp
        if (!userData && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          userData = tg.initDataUnsafe?.user;
          console.log('Data from Telegram.WebApp:', tg.initDataUnsafe);
        }
        
        // Если нашли данные пользователя
        if (userData) {
          const profile = {
            id: userData.id,
            firstName: userData.first_name || userData.firstName,
            lastName: userData.last_name || userData.lastName,
            username: userData.username,
            photoUrl: userData.photo_url || userData.photoUrl,
            languageCode: userData.language_code || userData.languageCode,
          };
          setUserProfile(profile);
          console.log('User profile set:', profile);
        } else {
          console.warn('No user data found in launch parameters');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to initialize application');
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
    return window.Telegram?.WebApp?.initData || window.Telegram?.WebApp?.initDataUnsafe;
  };

  if (loading) {
    return (
      <div className="telegram-app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telegram-app">
        <div className="error">{error}</div>
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
                    }}
                  />
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
            <p>Данные пользователя не доступны</p>
            <p>Откройте приложение через Telegram для получения данных</p>
            {!isTelegram() && (
              <p className="warning">⚠️ Приложение запущено вне Telegram</p>
            )}
          </div>
        )}
        
        <div className="app-info">
          <h3>Информация о приложении</h3>
          <p>Это демонстрация Telegram Mini App с использованием Telegram WebApp SDK</p>
        </div>
      </main>
    </div>
  );
}

export default TelegramApp;
