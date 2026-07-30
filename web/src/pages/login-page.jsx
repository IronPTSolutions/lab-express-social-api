import { Link, useNavigate } from "react-router";
import useAuth from "../contexts/auth-context";
import { LoginForm } from "../components/auth";
import * as api from "../services/api-service";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // onSubmit recibe los datos validados del formulario.
  // Llamamos a la API, guardamos el usuario en el contexto y navegamos a home.
  // Si hay error, LoginForm lo captura y lo muestra en el campo correspondiente.
  const handleSubmit = async (data) => {
    const user = await api.login(data);
    login(user);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido</h1>
        <p className="text-slate-500 text-sm mb-6">
          Inicia sesión para continuar
        </p>

        <LoginForm onSubmit={handleSubmit} />

        <p className="text-sm text-slate-500 text-center mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline font-medium"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
