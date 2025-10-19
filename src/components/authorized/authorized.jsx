import { useEffect, useState } from 'react';

const TelegramInit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [environment, setEnvironment] = useState('unknown');
  const [debugLog, setDebugLog] = useState([]);

  const addLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: ${message}`;
    
    console.log(logEntry, data || '');
    setDebugLog(prev => [...prev, logEntry]);
  };

  useEffect(() => {
    const detectEnvironment = () => {
      // Проверяем различные способы определения Telegram
      const isTelegram = (
        window.Telegram?.WebApp || 
        navigator.userAgent.includes('Telegram') ||
        window.location.hash.includes('tgWebApp') ||
        document.referrer.includes('telegram')
      );

      if (isTelegram) {
        setEnvironment('telegram');
        addLog('✅ Обнаружена среда Telegram');
      } else if (window.location.hostname.includes('алитис.рф') || 
                 window.location.hostname.includes('xn--80aefasgqac6c.xn--p1ai')) {
        setEnvironment('web');
        addLog('🌐 Открыто в веб-браузере');
      } else {
        setEnvironment('local');
        addLog('💻 Локальная разработка');
      }
    };

    const initTelegramApp = () => {
      detectEnvironment();

      if (environment === 'web' || environment === 'local') {
        addLog('ℹ️ Это веб-версия, Telegram WebApp не доступен');
        setLoading(false);
        setError('Откройте приложение через Telegram бота для получения данных');
        return;
      }

      // Только для Telegram среды
      try {
        if (!window.Telegram?.WebApp) {
          addLog('❌ Telegram WebApp объект не найден в Telegram среде');
          setError('Telegram WebApp не загружен. Возможно проблема с скриптом Telegram.');
          setLoading(false);
          return;
        }

        const tg = window.Telegram.WebApp;
        
        addLog('📱 Инициализация Telegram WebApp...');
        addLog(`Платформа: ${tg.platform}`);
        addLog(`Версия: ${tg.version}`);
        addLog(`InitData: ${tg.initData ? 'есть' : 'нет'}`);
        addLog(`InitDataUnsafe:`, tg.initDataUnsafe);

        // Критически важно для iOS!
        tg.ready();
        tg.expand();
        addLog('✅ WebApp готов и раскрыт');

        // Проверка данных пользователя
        const checkUserData = () => {
          const userData = tg.initDataUnsafe?.user;
          if (userData?.id) {
            addLog(`🎉 Данные пользователя получены: ${userData.first_name} (ID: ${userData.id})`);
            return true;
          }
          return false;
        };

        // Немедленная проверка
        if (checkUserData()) {
          setUser(tg.initDataUnsafe.user);
          setLoading(false);
          return;
        }

        addLog('⏳ Данные не получены сразу, начинаем ожидание...');

        // Стратегия для iOS
        let resolved = false;
        let attempts = 0;
        const maxAttempts = 50;

        // Событие viewportChanged
        const handleViewportChanged = () => {
          if (resolved) return;
          addLog('📐 Сработало viewportChanged');
          if (checkUserData()) {
            resolved = true;
            setUser(tg.initDataUnsafe.user);
            setLoading(false);
            tg.offEvent('viewportChanged', handleViewportChanged);
          }
        };

        tg.onEvent('viewportChanged', handleViewportChanged);

        // Периодическая проверка
        const interval = setInterval(() => {
          if (resolved) {
            clearInterval(interval);
            return;
          }

          attempts++;
          addLog(`🔄 Попытка ${attempts}/${maxAttempts}`);

          if (checkUserData()) {
            resolved = true;
            setUser(tg.initDataUnsafe.user);
            setLoading(false);
            clearInterval(interval);
            tg.offEvent('viewportChanged', handleViewportChanged);
            return;
          }

          // Диагностика каждые 10 попыток
          if (attempts % 10 === 0) {
            addLog(`📊 Диагностика на попытке ${attempts}:`, {
              initData: tg.initData?.length || 0,
              hasUser: !!tg.initDataUnsafe?.user,
              platform: tg.platform
            });
          }

          if (attempts >= maxAttempts) {
            addLog('⏰ Таймаут: данные не получены');
            clearInterval(interval);
            setError(`Не удалось получить данные после ${maxAttempts} попыток. Возможно проблема с iOS.`);
            setLoading(false);
          }
        }, 1000);

        // Очистка
        return () => {
          clearInterval(interval);
          if (window.Telegram?.WebApp) {
            tg.offEvent('viewportChanged', handleViewportChanged);
          }
        };

      } catch (err) {
        addLog(`❌ Ошибка инициализации: ${err.message}`);
        setError(`Ошибка: ${err.message}`);
        setLoading(false);
      }
    };

    // Запускаем с задержкой для стабилизации
    setTimeout(initTelegramApp, 100);
  }, [environment]);

  // Рендер
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2>🔍 Анализ среды выполнения</h2>
        
        <div style={{ 
          background: '#fff3cd', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <h3>📋 Информация о среде:</h3>
          <p><strong>Окружение:</strong> {environment === 'telegram' ? 'Telegram' : 
                                       environment === 'web' ? 'Веб-браузер' : 'Локальная разработка'}</p>
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          <p><strong>URL:</strong> {window.location.href}</p>
        </div>

        <h3>🔄 Инициализация Telegram WebApp...</h3>

        <div style={{ 
          marginTop: '20px',
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <h4>Лог в реальном времени:</h4>
          {debugLog.map((log, index) => (
            <div key={index} style={{ 
              padding: '4px 8px',
              margin: '2px 0',
              background: index % 2 === 0 ? '#fff' : '#f9f9f9',
              fontFamily: 'monospace',
              fontSize: '12px',
              borderLeft: '3px solid #007bff'
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#dc3545' }}>❌ Результат инициализации</h2>
        
        <div style={{ 
          background: environment === 'telegram' ? '#f8d7da' : '#d1ecf1', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${environment === 'telegram' ? '#f5c6cb' : '#bee5eb'}`
        }}>
          <h3>📋 Статус:</h3>
          <p><strong>Окружение:</strong> 
            {environment === 'telegram' ? ' 💬 Telegram' : 
             environment === 'web' ? ' 🌐 Веб-браузер' : ' 💻 Локальная разработка'}
          </p>
          <p><strong>Проблема:</strong> {error}</p>
          
          {environment !== 'telegram' && (
            <div style={{ marginTop: '15px' }}>
              <h4>🚀 Как протестировать в Telegram:</h4>
              <ol>
                <li>Откройте Telegram</li>
                <li>Найдите вашего бота</li>
                <li>Нажмите на Menu Button (кнопка меню)</li>
                <li>Должно открыться это приложение внутри Telegram</li>
              </ol>
            </div>
          )}
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Обновить страницу
        </button>

        <div style={{ 
          marginTop: '20px',
          background: '#e9ecef',
          padding: '15px',
          borderRadius: '8px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <h4>История логов:</h4>
          {debugLog.map((log, index) => (
            <div key={index} style={{ 
              padding: '4px 8px',
              margin: '2px 0',
              background: index % 2 === 0 ? '#fff' : '#f9f9f9',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#28a745' }}>✅ Успешная инициализация!</h2>
      
      <div style={{ 
        background: '#d4edda', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🎉 Данные пользователя Telegram:</h3>
        <pre style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '14px'
        }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ 
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        maxHeight: '300px',
        overflow: 'auto'
      }}>
        <h4>Полный лог инициализации:</h4>
        {debugLog.map((log, index) => (
          <div key={index} style={{ 
            padding: '4px 8px',
            margin: '2px 0',
            background: index % 2 === 0 ? '#fff' : '#f9f9f9',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramInit;
