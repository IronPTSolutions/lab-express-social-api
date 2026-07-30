import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import useAuth from '../contexts/auth-context';
import { PageLayout } from '../components/layouts';
import { CommentForm, CommentItem } from '../components/comments';
import * as api from '../services/api-service';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { post } = await api.getPost(id);
        setPost(post);
      } catch (error) {
        console.error('Error al cargar el post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres borrar este post?')) return;
    await api.deletePost(id);
    navigate('/');
  };

  // Al crear un comentario, la API devuelve el comentario SIN author poblado.
  // Construimos el objeto author manualmente desde el usuario del contexto
  // para que CommentItem pueda renderizar username y detectar ownership.
  const handleCommentCreated = async (data) => {
    const { comment } = await api.createComment(id, data);
    const commentWithAuthor = {
      ...comment,
      author: { id: user.id, username: user.username },
    };
    setPost((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), commentWithAuthor],
    }));
  };

  const handleCommentDeleted = async (commentId) => {
    await api.deleteComment(id, commentId);
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.id !== commentId),
    }));
  };

  if (loading) {
    return (
      <PageLayout>
        <p className="text-slate-500 text-center py-8">Cargando...</p>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <p className="text-red-600 text-center py-8">Post no encontrado.</p>
      </PageLayout>
    );
  }

  const isOwner = user?.id === post.author?.id;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <PageLayout>
      <Link to="/" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Volver al inicio
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-800">{post.title}</h1>
          {isOwner && (
            <div className="flex gap-2 shrink-0">
              <Link
                to={`/posts/${id}/edit`}
                className="text-sm bg-slate-100 text-slate-700 rounded-lg px-3 py-1 hover:bg-slate-200 transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="text-sm bg-red-600 text-white rounded-lg px-3 py-1 hover:bg-red-700 transition-colors"
              >
                Borrar
              </button>
            </div>
          )}
        </div>

        <p className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</p>

        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
          <span>@{post.author?.username}</span>
          <span>·</span>
          <span>{formattedDate}</span>
        </div>
      </article>

      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Comentarios ({post.comments?.length || 0})
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleCommentDeleted}
              />
            ))
          ) : (
            <p className="text-slate-400 text-sm py-2">Sin comentarios todavía.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <CommentForm onSubmit={handleCommentCreated} />
        </div>
      </section>
    </PageLayout>
  );
}

export default PostDetailPage;
