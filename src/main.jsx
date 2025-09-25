import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// If you're running in a plain browser, we inject a mock Telegram.WebApp
if (!window.Telegram) {
  import("./telegramMock").then((m) => {
    window.Telegram = m.createMockTelegram();
    if (window.Telegram.WebApp && window.Telegram.WebApp.ready) {
      window.Telegram.WebApp.ready();
    }
    renderApp();
  });
} else {
  renderApp();
}

function renderApp() {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
