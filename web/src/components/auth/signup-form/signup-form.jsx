import { useForm } from "react-hook-form";

function SignupForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "all" });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.entries(serverErrors).forEach(([field, message]) => {
          setError(field, { message });
        });
      } else {
        setError("root", {
          message: error.response?.data?.message || "Error al registrarse",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {errors.root && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errors.root.message}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "El nombre es obligatorio" })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tu nombre completo"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Usuario
        </label>
        <input
          id="username"
          type="text"
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
          })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="@usuario"
        />
        {errors.username && (
          <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "El email es obligatorio" })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}

export default SignupForm;
