import { useEffect, useState, useRef } from 'react'

export default function useTelegramWebApp() {
  const [ready, setReady] = useState(false)
  const webappRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const tg = window.Telegram
    if (!tg || !tg.WebApp) {
      console.warn('Telegram.WebApp not found — make sure to mock it for local dev')
      return
    }

    webappRef.current = tg.WebApp

    const onReady = () => setReady(true)

    try { if (typeof tg.WebApp.ready === 'function') tg.WebApp.ready() } catch(e){}

    tg.WebApp.onEvent && tg.WebApp.onEvent('ready', onReady)

    if (tg.WebApp.initDataUnsafe) onReady()

    return () => {
      tg.WebApp.offEvent && tg.WebApp.offEvent('ready', onReady)
    }
  }, [])

  return { webapp: webappRef.current, ready }
}
