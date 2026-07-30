import useAuth from '../contexts/auth-context';
import { Navigate } from 'react-router';

// PrivateRoute protege cualquier ruta que requiere autenticación.
// Si el usuario no está logueado (user === undefined), renderiza un <Navigate>
// que redirige a /login sin recargar la página.
// Usamos <Navigate> de React Router en lugar de window.location para mantener
// la navegación dentro del sistema de React Router (sin recargas del servidor).
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
