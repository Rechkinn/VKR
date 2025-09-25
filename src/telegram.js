export const initTelegramApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    // Расширяем приложение на весь экран
    window.Telegram.WebApp.expand();
    
    // Устанавливаем цвет заголовка
    window.Telegram.WebApp.setHeaderColor('#5c3b12');
    window.Telegram.WebApp.setBackgroundColor('#f5f5f5');
    
    console.log('Telegram WebApp инициализирован');
  } else {
    console.error('Telegram WebApp не доступен');
  }
};

export const getUserData = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe?.user || null;
  }
  return null;
};

export const sendDataToBot = (data) => {
  if (window.Telegram && window.Telegram.WebApp) {
    // Отправляем данные обратно в бота
    window.Telegram.WebApp.sendData(JSON.stringify(data));
  }
};

export const closeApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.close();
  }
};

// Дополнительные утилиты
export const showAlert = (message) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  }
};

export const showConfirm = (message, callback) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback);
  }
};
