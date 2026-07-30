import { useState, useContext, createContext } from 'react';

// Clave usada para guardar y leer el usuario en localStorage
export const LS_USER_KEY = 'current-user';

// Creamos el contexto vacío — su valor real lo provee AuthContextProvider
const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  // Inicializamos el estado desde localStorage para que la sesión sobreviva un refresco de página.
  // Si el usuario cierra la pestaña y la vuelve a abrir, seguirá logueado sin tener que pedir
  // al servidor que verifique la cookie (optimización UX, no de seguridad).
  const [user, setUser] = useState(
    localStorage.getItem(LS_USER_KEY)
      ? JSON.parse(localStorage.getItem(LS_USER_KEY))
      : undefined
  );

  // login guarda el usuario tanto en el estado de React (re-render inmediato)
  // como en localStorage (persistencia entre recargas)
  const login = (user) => {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  // logout elimina el usuario del estado y de localStorage.
  // La cookie de sesión la elimina el servidor al llamar a DELETE /sessions.
  const logout = () => {
    localStorage.removeItem(LS_USER_KEY);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth es el export por defecto — así los componentes importan directamente el hook
// sin necesidad de importar AuthContext y llamar a useContext manualmente.
// Patrón: import useAuth from '../contexts/auth-context'
export default function useAuth() {
  return useContext(AuthContext);
}
