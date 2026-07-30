import { Link, useNavigate } from 'react-router';
import useAuth from '../../../contexts/auth-context';
import * as api from '../../../services/api-service';

// Navbar fija en la parte superior. Muestra enlaces de navegación y el botón de logout.
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Secuencia de logout:
  // 1. Llamamos al servidor para invalidar la cookie de sesión (DELETE /sessions).
  // 2. Limpiamos el estado local del contexto (elimina localStorage + resetea user a undefined).
  // 3. Navegamos a /login para que el usuario vea la pantalla de inicio de sesión.
  // El orden importa: si navegamos antes de limpiar el contexto, PrivateRoute podría
  // redirigir de vuelta a la ruta protegida antes de que el estado se actualice.
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (_) {
      // Si el servidor falla, hacemos logout local igualmente
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-10 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="font-bold text-lg tracking-tight hover:text-indigo-300 transition-colors">
        SocialApp
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-sm hover:text-indigo-300 transition-colors">
            {user.username}
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
