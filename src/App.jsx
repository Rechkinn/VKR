import { useEffect, useState } from "react";
import { init, retrieveLaunchParams, useInitData } from '@telegram-apps/sdk-react';
import Header from "./components/Header/Header";
import "./App.css";

interface UserProfile {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
}

function TelegramApp() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Используем хук для получения данных инициализации
  const initData = useInitData();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инициализируем SDK
        init();
        
        // Получаем параметры запуска
        const launchParams = retrieveLaunchParams();
        console.log('Launch params:', launchParams);
        
        // Если есть данные инициализации, извлекаем профиль пользователя
        if (initData && initData.user) {
          const user = initData.user;
          const profile: UserProfile = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            photoUrl: user.photoUrl,
            languageCode: user.languageCode,
          };
          setUserProfile(profile);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to initialize application');
        setLoading(false);
      }
    };

    initializeApp();
  }, [initData]);

  // Функция для форматирования ID пользователя
  const formatUserId = (id: number): string => {
    return id.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
                      // Fallback если изображение не загружается
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="avatar-placeholder">
                  <span>{userProfile.firstName[0]}{userProfile.lastName?.[0]}</span>
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
                  <span>{userProfile.firstName}</span>
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
            <p>Откройте приложение через Telegram</p>
          </div>
        )}
        
        {/* Дополнительная информация о приложении */}
        <div className="app-info">
          <h3>Информация о приложении</h3>
          <p>Это демонстрация Telegram Mini App с использованием Telegram WebApp SDK</p>
        </div>
      </main>
    </div>
  );
}

export default TelegramApp;
