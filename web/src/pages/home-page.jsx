import { useState, useEffect, useContext } from "react";
import { PageLayout } from "../components/layouts";
import { PostsList, PostForm } from "../components/posts";
import * as api from "../services/api-service";

function HomePage() {
  // useState almacena el array de posts. Empieza como array vacío para que
  // PostsList pueda renderizar el estado inicial sin errores.
  const [posts, setPosts] = useState([]);
  // loading controla si mostramos el spinner o el contenido
  const [loading, setLoading] = useState(true);

  // useEffect con array de dependencias vacío [] se ejecuta solo una vez,
  // equivalente a componentDidMount en componentes de clase.
  // Es el lugar correcto para hacer el fetch inicial de datos.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await api.listPosts();
        setPosts(posts);
      } catch (error) {
        console.error("Error al cargar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Al crear un post nuevo, lo anteponemos al array existente con spread.
  // Así evitamos hacer otro fetch a la API — optimización UX.
  const handlePostCreated = async (data) => {
    const post = await api.createPost(data);

    // Reload posts after creation
    const posts = await api.listPosts();
    setPosts(posts);
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Inicio</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <h2 className="text-sm font-medium text-slate-600 mb-3">
          Nueva publicación
        </h2>
        <PostForm onSubmit={handlePostCreated} />
      </div>

      {loading ? (
        <p className="text-slate-500 text-center py-8">
          Cargando publicaciones...
        </p>
      ) : (
        <PostsList posts={posts} />
      )}
    </PageLayout>
  );
}

export default HomePage;
