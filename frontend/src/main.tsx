import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Limpar cache de service workers se existirem (apenas em contexto seguro)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => {
          // Ignorar erros silenciosamente
        });
      });
    }).catch(() => {
      // Ignorar erros silenciosamente
    });
  } catch (error) {
    // Ignorar erros silenciosamente
  }
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
  