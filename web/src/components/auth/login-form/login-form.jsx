import { useForm } from 'react-hook-form';

// LoginForm recibe onSubmit desde LoginPage.
// react-hook-form gestiona el estado de los campos y la validación de forma declarativa.
// No necesitamos useState por cada campo — register conecta el input al formulario.
function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'all' });

  // handleSubmit valida todos los campos antes de llamar a onSubmit.
  // Si onSubmit lanza un error del servidor, usamos setError para mostrarlo
  // en el campo correspondiente sin desmontar el formulario.
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
        setError('root', { message: error.response?.data?.message || 'Error al iniciar sesión' });
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
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          // register conecta este input al formulario: gestiona value, onChange y onBlur
          {...register('email', { required: 'El email es obligatorio' })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'La contraseña es obligatoria' })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}

export default LoginForm;
