import React, { useEffect, useState} from "react";
import useTelegramWebApp from "../hooks/useTelegramWebApp";

export default function Header() {
 const [user, setUser] = useState(null);

  useEffect(() => {
    // Получаем initData от Telegram
    const tg = window.Telegram.WebApp;
    const initData = tg.initData;
    
    if (initData) {
      // Отправляем на бэкенд
      fetch('http://localhost:8000/api/v1/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: initData
        })
      })
      .then(res => res.json())
      .then(data => {
        // Сохраняем токен
        localStorage.setItem('access_token', data.access_token);
        setUser(data.user);
      })
      .catch(err => console.error('Auth error:', err));
    }
  }, []);
  
  return (
    <div>
      {user ? (
        <h1>Welcome, {user.first_name}!</h1>
      ) : (
        <p>Authenticating...</p>
      )}
    </div>
  );
}
