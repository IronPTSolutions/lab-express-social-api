import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

// PostForm se reutiliza tanto para crear como para editar un post.
// - En modo creación: no recibe defaultValues, el formulario aparece vacío.
// - En modo edición: recibe defaultValues con title y body del post existente.
// La prop onSubmit es responsabilidad de la página padre — este componente
// solo gestiona el formulario y delega la lógica de negocio.
function PostForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'all', defaultValues });

  // Cuando defaultValues cambia (por ejemplo, al cargar el post en edición),
  // reseteamos el formulario para que los inputs muestren los valores actualizados.
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    // En modo creación (sin defaultValues) reseteamos el formulario tras crear el post
    if (!defaultValues) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Título del post"
          {...register('title', { required: 'El título es obligatorio' })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <textarea
          rows={4}
          placeholder="¿Qué quieres compartir?"
          {...register('body', { required: 'El contenido es obligatorio' })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        {errors.body && <p className="text-red-600 text-sm mt-1">{errors.body.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting ? 'Guardando...' : defaultValues ? 'Guardar cambios' : 'Publicar'}
      </button>
    </form>
  );
}

export default PostForm;
