import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Saat data user masih di-load, jangan tampilkan apa-apa
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  // Jika belum login → alihkan ke /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login → tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;
