import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { PostForm } from "../components/posts";
import * as api from "../services/api-service";

function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [defaultValues, setDefaultValues] = useState(null);

  // Cargamos el post para rellenar el formulario con los valores actuales
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await api.getPost(id);
        setDefaultValues({ title: post.title, body: post.body });
      } catch (error) {
        console.error("Error al cargar el post para editar:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (data) => {
    await api.updatePost(id, data);
    navigate(`/posts/${id}`);
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Editar publicación
      </h1>

      {defaultValues ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <PostForm onSubmit={handleSubmit} defaultValues={defaultValues} />
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">Cargando...</p>
      )}
    </PageLayout>
  );
}

export default PostEditPage;
