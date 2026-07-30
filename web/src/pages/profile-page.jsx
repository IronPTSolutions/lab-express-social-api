import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts";
import { PostsList } from "../components/posts";
import * as api from "../services/api-service";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await api.getProfile();
        setProfile(user);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <p className="text-slate-500 text-center py-8">Cargando perfil...</p>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <p className="text-red-600 text-center py-8">
          No se pudo cargar el perfil.
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {profile.name}
        </h1>
        <p className="text-indigo-600 font-medium mb-1">@{profile.username}</p>
        <p className="text-slate-500 text-sm">{profile.email}</p>
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Publicaciones ({profile.posts?.length || 0})
      </h2>

      {/* profile.posts viene poblado desde GET /users/me */}
      <PostsList posts={profile.posts || []} />
    </PageLayout>
  );
}

export default ProfilePage;
