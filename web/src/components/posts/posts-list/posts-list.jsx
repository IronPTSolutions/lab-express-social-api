import { PostCard } from '../index';

// PostsList renderiza una lista de PostCard.
// Recibe el array de posts desde la página padre — no hace fetch propio.
// Separar la lista del fetch facilita reutilizarla (por ejemplo en ProfilePage).
function PostsList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-slate-500 text-center py-8">
        No hay publicaciones todavía. ¡Sé el primero en publicar!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostsList;
