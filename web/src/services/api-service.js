import axios from "axios";
import { LS_USER_KEY } from "../contexts/auth-context";

// axios.create() genera una instancia preconfigurada con baseURL y opciones comunes.
// Así no repetimos la URL base ni las opciones en cada llamada a la API.
const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  // withCredentials: true le indica al navegador que incluya la cookie de sesión
  // en cada petición cross-origin. Sin esto, el servidor no puede identificar al usuario.
  withCredentials: true,
});

// El interceptor de respuesta nos permite transformar todas las respuestas en un solo lugar:
// - En caso de éxito devolvemos response.data directamente, para no hacer .data en cada llamada.
// - En caso de error 401 (sesión expirada o no autenticado), limpiamos el estado local
//   y redirigimos al login. Usamos window.location.replace para forzar una recarga completa
//   y limpiar cualquier estado de React en memoria.
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.status === 401 && location.pathname !== "/login") {
      window.location = "/login";
    }

    return Promise.reject(error);
  },
);

// --- Auth ---
export const login = (data) => http.post("/sessions", data);
export const signup = (data) => http.post("/users", data);
export const logout = () => http.delete("/sessions");
export const getProfile = () => http.get("/users/me");

// --- Posts ---
export const listPosts = () => http.get("/posts");
export const getPost = (id) => http.get(`/posts/${id}`);
export const createPost = (data) => http.post("/posts", data);
export const updatePost = (id, data) => http.patch(`/posts/${id}`, data);
export const deletePost = (id) => http.delete(`/posts/${id}`);

// --- Comments ---
export const createComment = (postId, data) =>
  http.post(`/posts/${postId}/comments`, data);
export const deleteComment = (postId, commentId) =>
  http.delete(`/posts/${postId}/comments/${commentId}`);
