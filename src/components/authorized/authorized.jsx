import { useEffect, useState } from 'react';

const TelegramInit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);

  const addLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const initTelegramApp = () => {
      try {
        addLog('🚀 Инициализация Telegram WebApp...');

        if (!window.Telegram?.WebApp) {
          addLog('❌ Telegram WebApp не доступен');
          setError('Telegram WebApp не доступен');
          setLoading(false);
          return;
        }

        const tg = window.Telegram.WebApp;
        
        // Логируем базовую информацию
        addLog(`📱 Платформа: ${tg.platform}`);
        addLog(`🔢 Версия: ${tg.version}`);
        addLog(`📊 InitData: ${tg.initData ? 'есть' : 'нет'}`);
        addLog(`👤 Пользователь: ${tg.initDataUnsafe?.user ? 'есть' : 'нет'}`);

        // Критически важно для iOS!
        tg.ready();
        tg.expand(); // Раскрываем на весь экран
        addLog('✅ Telegram WebApp готов и раскрыт');

        // Основная функция проверки данных
        const checkData = () => {
          const userData = tg.initDataUnsafe?.user;
          addLog(`🔍 Проверка данных пользователя: ${userData ? `ID: ${userData.id}` : 'нет данных'}`);
          
          if (userData?.id) {
            addLog(`✅ Данные пользователя получены: ${userData.first_name} (${userData.id})`);
            setUser(userData);
            setLoading(false);
            return true;
          }
          return false;
        };

        // Проверяем сразу
        if (checkData()) {
          return;
        }

        addLog('⏳ Данные не получены сразу, начинаем ожидание...');

        // Способ 1: Событие viewportChanged (лучший для iOS)
        const handleViewportChanged = () => {
          addLog('🎯 Сработало событие viewportChanged');
          if (checkData()) {
            tg.offEvent('viewportChanged', handleViewportChanged);
            addLog('📡 Событие viewportChanged отключено');
          }
        };

        tg.onEvent('viewportChanged', handleViewportChanged);

        // Способ 2: Периодическая проверка
        let attempts = 0;
        const maxAttempts = 30; // 30 секунд максимум
        
        const intervalId = setInterval(() => {
          attempts++;
          addLog(`🔄 Попытка ${attempts}/${maxAttempts}`);
          
          if (checkData()) {
            clearInterval(intervalId);
            tg.offEvent('viewportChanged', handleViewportChanged);
          }

          if (attempts >= maxAttempts) {
            addLog('⏰ Время ожидания истекло');
            clearInterval(intervalId);
            tg.offEvent('viewportChanged', handleViewportChanged);
            
            // Финальная проверка
            const finalData = tg.initDataUnsafe?.user;
            if (finalData?.id) {
              addLog(`✅ Данные получены на последней проверке: ${finalData.first_name}`);
              setUser(finalData);
            } else {
              addLog('❌ Не удалось получить данные пользователя');
              setError('Не удалось загрузить данные пользователя. Попробуйте перезагрузить страницу.');
            }
            setLoading(false);
          }
        }, 1000);

        // Способ 3: Триггер по клику пользователя
        const handleUserClick = () => {
          addLog('🖱️ Пользователь кликнул - проверяем данные');
          checkData();
        };

        document.addEventListener('click', handleUserClick, { once: true });

        // Очистка
        return () => {
          clearInterval(intervalId);
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.offEvent('viewportChanged', handleViewportChanged);
          }
          document.removeEventListener('click', handleUserClick);
        };

      } catch (err) {
        addLog(`❌ Ошибка инициализации: ${err.message}`);
        setError(`Ошибка инициализации: ${err.message}`);
        setLoading(false);
      }
    };

    // Запускаем когда DOM готов
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelegramApp);
    } else {
      initTelegramApp();
    }
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>🔄 Загрузка данных Telegram...</h3>
        <p>Пожалуйста, подождите. Это может занять несколько секунд.</p>
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f5f5f5', 
          borderRadius: '5px',
          fontSize: '12px',
          textAlign: 'left',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          <strong>Лог отладки:</strong>
          {debugLog.map((log, index) => (
            <div key={index} style={{ margin: '2px 0', fontFamily: 'monospace' }}>{log}</div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>❌ Ошибка</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Перезагрузить
        </button>
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#fff0f0', 
          borderRadius: '5px',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <strong>Лог отладки:</strong>
          {debugLog.map((log, index) => (
            <div key={index} style={{ margin: '2px 0', fontFamily: 'monospace' }}>{log}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>✅ Данные пользователя загружены!</h3>
      <div style={{ 
        marginTop: '15px', 
        padding: '15px', 
        background: '#f0f8ff', 
        borderRadius: '5px',
        border: '1px solid #007bff'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#f0f0f0', 
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <strong>Лог отладки:</strong>
        {debugLog.map((log, index) => (
          <div key={index} style={{ margin: '2px 0', fontFamily: 'monospace' }}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default TelegramInit;
