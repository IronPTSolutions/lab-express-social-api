import { useForm } from 'react-hook-form';

function CommentForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'all' });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Escribe un comentario..."
          {...register('body', { required: 'El comentario no puede estar vacío' })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {errors.body && <p className="text-red-600 text-sm mt-1">{errors.body.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium whitespace-nowrap"
      >
        Comentar
      </button>
    </form>
  );
}

export default CommentForm;
