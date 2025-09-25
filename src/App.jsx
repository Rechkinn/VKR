import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import "./App.css";

function TelegramApp() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telegramData, setTelegramData] = useState(null);

  useEffect(() => {
    const initializeApp = () => {
      try {
        console.log('Initializing Telegram Mini App...');
        
        // Проверяем доступность Telegram WebApp
        if (!window.Telegram || !window.Telegram.WebApp) {
          throw new Error('Telegram WebApp не найден. Убедитесь, что подключен telegram-web-app.js');
        }

        const tg = window.Telegram.WebApp;
        console.log('Telegram WebApp доступен:', tg);
        
        // Сохраняем информацию о Telegram
        setTelegramData({
          version: tg.version,
          platform: tg.platform,
          colorScheme: tg.colorScheme,
          initData: tg.initData,
          initDataUnsafe: tg.initDataUnsafe
        });

        // Настраиваем WebApp
        tg.ready(); // Уведомляем Telegram, что приложение готово
        tg.expand(); // Разворачиваем приложение на весь экран

        // Устанавливаем цвета темы
        if (tg.colorScheme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.add('light-theme');
        }

        // Получаем данные пользователя
        let userData = null;

        // Основной способ - через initDataUnsafe
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
          userData = tg.initDataUnsafe.user;
          console.log('User data from initDataUnsafe:', userData);
        }

        // Альтернативный способ - парсинг initData
        if (!userData && tg.initData) {
          try {
            const urlParams = new URLSearchParams(tg.initData);
            const userParam = urlParams.get('user');
            if (userParam) {
              userData = JSON.parse(decodeURIComponent(userParam));
              console.log('User data from parsed initData:', userData);
            }
          } catch (parseError) {
            console.warn('Error parsing initData:', parseError);
          }
        }

        // Если нашли данные пользователя
        if (userData) {
          const profile = {
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            username: userData.username,
            photoUrl: userData.photo_url,
            languageCode: userData.language_code,
            isPremium: userData.is_premium || false,
            allowsWriteToPm: userData.allows_write_to_pm
          };
          setUserProfile(profile);
          console.log('User profile set:', profile);
        } else {
          console.warn('No user data found in Telegram WebApp');
          
          // Для разработки и тестирования
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock data for development');
            setUserProfile({
              id: 123456789,
              firstName: 'Test',
              lastName: 'User',
              username: 'testuser',
              languageCode: 'ru',
              isPremium: false
            });
          }
        }

        // Настройка кнопки "Назад" если нужно
        if (tg.BackButton) {
          tg.BackButton.onClick(() => {
            console.log('Back button clicked');
            tg.close();
          });
        }

        // Настройка главной кнопки если нужно
        if (tg.MainButton) {
          tg.MainButton.setText('Готово');
          tg.MainButton.onClick(() => {
            console.log('Main button clicked');
            // Отправляем данные обратно в бот
            tg.sendData(JSON.stringify({
              action: 'completed',
              userId: userData?.id,
              timestamp: Date.now()
            }));
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(`Ошибка инициализации: ${err.message}`);
        setLoading(false);
      }
    };

    // Проверяем, загружен ли скрипт Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      initializeApp();
    } else {
      // Ждем загрузки скрипта
      const checkTelegram = setInterval(() => {
        if (window.Telegram && window.Telegram.WebApp) {
          clearInterval(checkTelegram);
          initializeApp();
        }
      }, 100);

      // Таймаут для предотвращения бесконечного ожидания
      setTimeout(() => {
        clearInterval(checkTelegram);
        if (!window.Telegram || !window.Telegram.WebApp) {
          setError('Telegram WebApp не загрузился. Проверьте подключение telegram-web-app.js');
          setLoading(false);
        }
      }, 5000);
    }

    // Очистка при размонтировании
    return () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.BackButton) {
          tg.BackButton.offClick();
        }
        if (tg.MainButton) {
          tg.MainButton.offClick();
        }
      }
    };
  }, []);

  // Функция для форматирования ID пользователя
  const formatUserId = (id) => {
    if (!id) return '';
    return id.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Проверяем, запущено ли в Telegram
  const isTelegram = () => {
    return !!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
  };

  // Функции для работы с Telegram WebApp
  const showMainButton = (text, onClick) => {
    if (window.Telegram?.WebApp?.MainButton) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide();
    }
  };

  const sendToTelegram = (data) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data));
    }
  };

  const closeMiniApp = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  if (loading) {
    return (
      <div className="telegram-app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Загрузка Telegram Mini App...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telegram-app">
        <div className="error">
          <h3>❌ Ошибка</h3>
          <p>{error}</p>
          <div className="error-details">
            <h4>Проверьте:</h4>
            <ul>
              <li>Добавлен ли скрипт в index.html: <code>&lt;script src="https://telegram.org/js/telegram-web-app.js?59"&gt;&lt;/script&gt;</code></li>
              <li>Открыто ли приложение через Telegram бот</li>
              <li>Правильно ли настроен Mini App в BotFather</li>
            </ul>
          </div>
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
        <h1>🚀 Telegram Mini App</h1>
        
        {/* Информация о Telegram WebApp */}
        {telegramData && (
          <div className="telegram-info">
            <h3>📱 Информация о WebApp</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Версия API:</label>
                <span>{telegramData.version}</span>
              </div>
              <div className="info-item">
                <label>Платформа:</label>
                <span>{telegramData.platform}</span>
              </div>
              <div className="info-item">
                <label>Тема:</label>
                <span>{telegramData.colorScheme === 'dark' ? '🌙 Темная' : '☀️ Светлая'}</span>
              </div>
            </div>
          </div>
        )}
        
        {userProfile ? (
          <div className="user-profile">
            <div className="profile-header">
              <h2>👤 Профиль пользователя</h2>
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
                      {userProfile.firstName?.[0] || ''}
                      {userProfile.lastName?.[0] || ''}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="avatar-placeholder">
                  <span>
                    {userProfile.firstName?.[0] || ''}
                    {userProfile.lastName?.[0] || ''}
                  </span>
                </div>
              )}
              
              {/* Информация о пользователе */}
              <div className="user-info">
                <div className="info-item">
                  <label>🆔 ID пользователя:</label>
                  <span className="user-id">{formatUserId(userProfile.id)}</span>
                </div>
                
                <div className="info-item">
                  <label>👤 Имя:</label>
                  <span>{userProfile.firstName || 'Не указано'}</span>
                </div>
                
                {userProfile.lastName && (
                  <div className="info-item">
                    <label>👤 Фамилия:</label>
                    <span>{userProfile.lastName}</span>
                  </div>
                )}
                
                {userProfile.username && (
                  <div className="info-item">
                    <label>📝 Username:</label>
                    <span>@{userProfile.username}</span>
                  </div>
                )}
                
                {userProfile.languageCode && (
                  <div className="info-item">
                    <label>🌍 Язык:</label>
                    <span>{userProfile.languageCode.toUpperCase()}</span>
                  </div>
                )}

                {userProfile.allowsWriteToPm !== undefined && (
                  <div className="info-item">
                    <label>💬 Разрешены ЛС:</label>
                    <span>{userProfile.allowsWriteToPm ? '✅ Да' : '❌ Нет'}</span>
                  </div>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="action-buttons">
                <button 
                  onClick={() => sendToTelegram({
                    action: 'profile_viewed', 
                    userId: userProfile.id,
                    timestamp: Date.now()
                  })}
                  className="action-btn primary"
                >
                  📤 Отправить данные в бот
                </button>
                
                <button 
                  onClick={() => showMainButton('Завершить', () => {
                    sendToTelegram({action: 'completed', userId: userProfile.id});
                  })}
                  className="action-btn"
                >
                  🔘 Показать главную кнопку
                </button>

                <button 
                  onClick={hideMainButton}
                  className="action-btn"
                >
                  🚫 Скрыть главную кнопку
                </button>
                
                <button 
                  onClick={closeMiniApp}
                  className="action-btn secondary"
                >
                  ❌ Закрыть приложение
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-user-data">
            <div className="no-data-icon">📱</div>
            <h3>Данные пользователя не найдены</h3>
            <p>Откройте приложение через Telegram бот для получения данных</p>
            {!isTelegram() && (
              <div className="warning">
                <span>⚠️</span>
                <p>Приложение запущено вне Telegram WebApp</p>
              </div>
            )}
            
            {/* Диагностическая информация */}
            <details className="debug-info">
              <summary>🔧 Диагностика</summary>
              <div className="debug-content">
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                <p><strong>Telegram объект:</strong> {window.Telegram ? '✅ Есть' : '❌ Нет'}</p>
                <p><strong>WebApp объект:</strong> {window.Telegram?.WebApp ? '✅ Есть' : '❌ Нет'}</p>
                {telegramData && (
                  <>
                    <p><strong>initData:</strong> {telegramData.initData ? 'Есть данные' : 'Пусто'}</p>
                    <p><strong>initDataUnsafe:</strong> {JSON.stringify(telegramData.initDataUnsafe, null, 2)}</p>
                  </>
                )}
              </div>
            </details>
          </div>
        )}
        
        <div className="app-info">
          <h3>ℹ️ О приложении</h3>
          <p>Демонстрация официального Telegram WebApp API</p>
          <div className="tech-info">
            <span>Статус: {isTelegram() ? '✅ В Telegram' : '❌ Вне Telegram'}</span>
            <span>API: Официальный Telegram WebApp</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TelegramApp;
