// App.jsx
import { useEffect, useState } from 'react';
import { initTelegramApp, getUserData, sendDataToBot, closeApp, showAlert } from './telegram';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация при загрузке компонента
  useEffect(() => {
    initTelegramApp();
    const userData = getUserData();
    setUser(userData);
    
    // Показываем приветствие
    if (userData) {
      showAlert(`Добро пожаловать, ${userData.first_name}!`);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      showAlert('Пожалуйста, введите сообщение!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Имитация задержки для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Отправляем данные в бота
      sendDataToBot({ 
        message,
        user: user ? {
          id: user.id,
          username: user.username
        } : null,
        timestamp: new Date().toISOString()
      });
      
      // Показываем подтверждение перед закрытием
      showAlert('Сообщение отправлено! Приложение закроется через 2 секунды.');
      
      // Закрываем приложение с задержкой
      setTimeout(() => {
        closeApp();
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка:', error);
      showAlert('Произошла ошибка при отправке сообщения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
  };

  // Если пользователь не загружен, показываем загрузку
  if (!user) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Загрузка...</h2>
          <p>Инициализация приложения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚗 AllTransfer Mini App</h1>
        {user && (
          <div className="user-info">
            <img 
              src={user.photo_url} 
              alt="User Avatar" 
              className="user-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="user-details">
              <p className="welcome">Добро пожаловать!</p>
              <p className="user-name">{user.first_name} {user.last_name || ''}</p>
              {user.username && <p className="username">@{user.username}</p>}
            </div>
          </div>
        )}
      </header>

      <main className="app-main">
        <section className="message-section">
          <h2>Отправить сообщение боту</h2>
          <form onSubmit={handleSubmit} className="message-form">
            <div className="form-group">
              <label htmlFor="message">Ваше сообщение:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите ваше сообщение здесь..."
                rows="4"
                maxLength="500"
                disabled={isLoading}
              />
              <div className="char-count">{message.length}/500</div>
            </div>
            
            <div className="button-group">
              <button 
                type="button" 
                onClick={handleClear}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Очистить
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading || !message.trim()}
                className="btn btn-primary"
              >
                {isLoading ? 'Отправка...' : '📨 Отправить боту'}
              </button>
            </div>
          </form>
        </section>

        <section className="info-section">
          <h3>Информация о приложении</h3>
          <div className="info-cards">
            <div className="info-card">
              <h4>🚗 Заказать трансфер</h4>
              <p>Найдите подходящую поездку для себя</p>
            </div>
            <div className="info-card">
              <h4>👥 Стать водителем</h4>
              <p>Предлагайте свои поездки пассажирам</p>
            </div>
            <div className="info-card">
              <h4>💰 Прозрачные цены</h4>
              <p>Никаких скрытых комиссий</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>AllTransfer Service © 2024</p>
      </footer>
    </div>
  );
}

export default App;
