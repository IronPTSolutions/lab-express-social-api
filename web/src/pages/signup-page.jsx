import { Link, useNavigate } from "react-router";
import useAuth from "../contexts/auth-context";
import { SignupForm } from "../components/auth";
import * as api from "../services/api-service";

function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await api.signup(data);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Crear cuenta</h1>
        <p className="text-slate-500 text-sm mb-6">Únete a la comunidad</p>

        <SignupForm onSubmit={handleSubmit} />

        <p className="text-sm text-slate-500 text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
