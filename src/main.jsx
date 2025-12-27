import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./services/reducers";
import Authorized from "./components/authorized/authorized";
import { BrowserRouter } from "react-router";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

// If you're running in a plain browser, we inject a mock Telegram.WebApp
if (window.Telegram) renderApp();

function renderApp() {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <Authorized />
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
}
