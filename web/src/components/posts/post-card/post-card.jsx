import { Link } from 'react-router';

// PostCard muestra el resumen de un post en la lista.
// Recibe el objeto post completo con author ya poblado desde el servidor.
function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <Link to={`/posts/${post.id}`}>
        <h2 className="text-lg font-semibold text-slate-800 hover:text-indigo-600 transition-colors mb-1">
          {post.title}
        </h2>
      </Link>
      <p className="text-slate-600 text-sm line-clamp-3 mb-3">{post.body}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>@{post.author?.username || 'desconocido'}</span>
        <span>{formattedDate}</span>
      </div>
    </article>
  );
}

export default PostCard;
