# Telegram Mini App — React starter

## Prerequisites
- Node 18+ and npm
- VS Code (recommended)

## Install
```bash
npm install
```

## Develop locally
```bash
npm run dev
```

## Test inside Telegram
1. Expose your local server using a tunnel (ngrok/localtunnel):
   `ngrok http 5173`
2. Set your bot/webapp URL to the tunnel URL and open the mini app in Telegram.

Tip: enable **webview inspection** in Telegram Desktop (experimental) to open DevTools for the webview.

Notes:
- Remove the mock (`src/telegramMock.js`) in production — it is for local dev only.
- Use `window.Telegram.WebApp.initData` / `initDataUnsafe` for authenticated flows.
