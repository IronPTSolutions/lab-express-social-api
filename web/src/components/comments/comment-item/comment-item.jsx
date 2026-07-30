import useAuth from '../../../contexts/auth-context';

// CommentItem muestra un comentario individual.
// Compara comment.author.id con el id del usuario logueado para mostrar
// el botón de borrar solo al autor del comentario.
function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();

  // comment.author puede ser un objeto (cuando el post viene del GET /posts/:id con populate)
  // o puede ser un string (en comentarios recién creados que construimos en el cliente).
  const authorUsername = comment.author?.username || 'Usuario';
  const isOwner = user?.id === comment.author?.id;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex items-start justify-between gap-2 py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-700">@{authorUsername}</span>
          <span className="text-xs text-slate-400">{formattedDate}</span>
        </div>
        <p className="text-sm text-slate-600">{comment.body}</p>
      </div>

      {isOwner && (
        <button
          onClick={() => onDelete(comment.id)}
          className="text-xs bg-red-600 text-white rounded-lg px-2 py-1 hover:bg-red-700 transition-colors shrink-0"
        >
          Borrar
        </button>
      )}
    </div>
  );
}

export default CommentItem;
