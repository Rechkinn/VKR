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
import { useEffect, useRef, useState } from "react";

export default function useTelegramWebApp({
  pollInterval = 200,
  pollTimeout = 6000,
} = {}) {
  const [ready, setReady] = useState(false);
  const [webapp, setWebapp] = useState(null);
  const [initData, setInitData] = useState(null);
  const [initDataUnsafe, setInitDataUnsafe] = useState(null);

  const pollRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let tries = 0;
    const tryAttach = () => {
      const tg = window.Telegram;
      if (!tg || !tg.WebApp) return false;

      const wa = tg.WebApp;
      setWebapp(wa);

      // init values
      setInitData(wa.initData ?? null);
      setInitDataUnsafe(wa.initDataUnsafe ?? null);

      // call ready if available (safe)
      try {
        wa.ready && typeof wa.ready === "function" && wa.ready();
      } catch (e) {
        /* ignore */
      }

      // if we already have init data or unsafe user -> ready
      if (
        (wa.initData && String(wa.initData).trim() !== "") ||
        wa.initDataUnsafe
      ) {
        setReady(true);
      }

      // subscribe to 'ready' and try to keep initData in sync if WebApp provides events
      const onReady = () => setReady(true);
      const onAnyUpdate = () => {
        setInitData(wa.initData ?? null);
        setInitDataUnsafe(wa.initDataUnsafe ?? null);
      };

      if (typeof wa.onEvent === "function") {
        wa.onEvent("ready", onReady);
        // attach a generic update listener if available
        wa.onEvent("auth", onAnyUpdate);
        wa.onEvent("initDataChanged", onAnyUpdate);
      }

      // as fallback for daft implementations: poll the object's initData for changes
      let lastInit = wa.initData;
      const fallbackPoll = setInterval(() => {
        if (!wa) return;
        if (wa.initData !== lastInit) {
          lastInit = wa.initData;
          onAnyUpdate();
        }
      }, 250);

      // store cleanup
      pollRef.current = () => {
        try {
          clearInterval(fallbackPoll);
        } catch (e) {}
        if (typeof wa.offEvent === "function") {
          wa.offEvent && wa.offEvent("ready", onReady);
          wa.offEvent && wa.offEvent("auth", onAnyUpdate);
          wa.offEvent && wa.offEvent("initDataChanged", onAnyUpdate);
        }
      };

      return true;
    };

    if (tryAttach()) return;

    // Poll for a short time for injection (mobile may be late)
    const interval = setInterval(() => {
      tries += 1;
      if (stopRef.current) {
        clearInterval(interval);
        return;
      }
      if (tryAttach()) {
        clearInterval(interval);
      } else if (tries * pollInterval >= pollTimeout) {
        clearInterval(interval);
      }
    }, pollInterval);

    return () => {
      stopRef.current = true;
      clearInterval(interval);
      if (pollRef.current) {
        try {
          pollRef.current();
        } catch (e) {}
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { webapp, ready, initData, initDataUnsafe };
}
