import { Routes, Route } from "react-router";
import { PrivateRoute } from "./guards";
import { Navbar } from "./components/ui";
import {
  LoginPage,
  SignupPage,
  HomePage,
  PostDetailPage,
  PostEditPage,
  ProfilePage,
} from "./pages";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PrivateRoute>
              <PostDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <PrivateRoute>
              <PostEditPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
