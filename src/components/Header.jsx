import React, { useEffect } from 'react'
import useTelegramWebApp from '../hooks/useTelegramWebApp'

export default function Header() {
  const { webapp, ready } = useTelegramWebApp()

  useEffect(() => {
    if (!ready || !webapp) return
    try {
      if (webapp.setHeaderColor) webapp.setHeaderColor('#0088cc')
    } catch (e) {}

    if (webapp.MainButton && webapp.MainButton.setText) {
      webapp.MainButton.setText('Done')
      webapp.MainButton.show && webapp.MainButton.show()
    }

    const onMain = () => {
      if (webapp.sendData) webapp.sendData('clicked-main')
      else console.log('Main clicked')
    }

    webapp.MainButton && webapp.MainButton.onClick && webapp.MainButton.onClick(onMain)

    return () => {
      webapp.MainButton && webapp.MainButton.offClick && webapp.MainButton.offClick(onMain)
    }
  }, [ready, webapp])

  return (
    <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
      <h1>My TG Mini App (React)</h1>
      <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
        Telegram.WebApp {ready ? 'connected' : 'not connected'}
      </p>
    </header>
  )
}
