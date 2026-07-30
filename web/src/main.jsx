import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { AuthContextProvider } from "./contexts/auth-context";
import "./index.css";
import App from "./App.jsx";

// AuthContextProvider debe envolver a BrowserRouter para que todos los componentes
// de ruta puedan acceder al contexto de autenticación con useAuth().
// El orden importa: Provider exterior → Router interior → App con rutas.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Router>
  </StrictMode>,
);
