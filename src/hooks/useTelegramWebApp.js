// import { useEffect, useState, useRef } from 'react'

// export default function useTelegramWebApp() {
//   const [ready, setReady] = useState(false)
//   const webappRef = useRef(null)

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const tg = window.Telegram
//     if (!tg || !tg.WebApp) {
//       console.warn('Telegram.WebApp not found — make sure to mock it for local dev')
//       return
//     }

//     webappRef.current = tg.WebApp

//     const onReady = () => setReady(true)

//     try { if (typeof tg.WebApp.ready === 'function') tg.WebApp.ready() } catch(e){}

//     tg.WebApp.onEvent && tg.WebApp.onEvent('ready', onReady)

//     if (tg.WebApp.initDataUnsafe) onReady()

//     return () => {
//       tg.WebApp.offEvent && tg.WebApp.offEvent('ready', onReady)
//     }
//   }, [])

//   return { webapp: webappRef.current, ready }
// }

// src/hooks/useTelegramWebApp.js
// src/hooks/useTelegramWebApp.js
import { useEffect, useRef, useState } from "react";

export default function useTelegramWebApp({
  pollInterval = 250,
  pollTimeout = 15000,
} = {}) {
  const [webapp, setWebapp] = useState(null);
  const [ready, setReady] = useState(false);
  const [initData, setInitData] = useState(null);
  const [initDataUnsafe, setInitDataUnsafe] = useState(null);

  const attachRef = useRef({ attached: false });
  const pollTimerRef = useRef(null);
  const detachCleanupRef = useRef(null);

  const tryAttach = () => {
    try {
      const tg = window?.Telegram;
      if (!tg || !tg.WebApp) return false;

      const wa = tg.WebApp;
      setWebapp(wa);
      setInitData(wa.initData ?? null);
      setInitDataUnsafe(wa.initDataUnsafe ?? null);

      // call ready safely
      try {
        wa.ready && typeof wa.ready === "function" && wa.ready();
      } catch (e) {}

      // if there is initData or unsafe -> ready (fast path)
      if (
        (wa.initData && String(wa.initData).trim() !== "") ||
        wa.initDataUnsafe
      ) {
        setReady(true);
      }

      // subscribe to events if API supports it
      const onReady = () => setReady(true);
      const syncInit = () => {
        setInitData(wa.initData ?? null);
        setInitDataUnsafe(wa.initDataUnsafe ?? null);
      };

      if (typeof wa.onEvent === "function") {
        wa.onEvent("ready", onReady);
        wa.onEvent("auth", syncInit);
        wa.onEvent("initDataChanged", syncInit);
      }

      // fallback polling for initData changes
      let last = wa.initData;
      const fallback = setInterval(() => {
        if (wa.initData !== last) {
          last = wa.initData;
          syncInit();
        }
      }, 350);

      detachCleanupRef.current = () => {
        clearInterval(fallback);
        if (typeof wa.offEvent === "function") {
          wa.offEvent("ready", onReady);
          wa.offEvent("auth", syncInit);
          wa.offEvent("initDataChanged", syncInit);
        }
      };

      attachRef.current.attached = true;
      return true;
    } catch (e) {
      console.warn("tryAttach error", e);
      return false;
    }
  };

  useEffect(() => {
    let tries = 0;
    if (tryAttach()) return;

    const interval = setInterval(() => {
      tries += 1;
      if (attachRef.current.attached) {
        clearInterval(interval);
        return;
      }
      if (tryAttach()) {
        clearInterval(interval);
      } else if (tries * pollInterval >= pollTimeout) {
        clearInterval(interval);
      }
    }, pollInterval);

    // also try when tab gets focus or visibility changes (mobile can inject then)
    const onFocus = () => tryAttach();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      if (detachCleanupRef.current) {
        try {
          detachCleanupRef.current();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // expose forceAttach to manually retry
  const forceAttach = () => tryAttach();

  return { webapp, ready, initData, initDataUnsafe, forceAttach };
}
