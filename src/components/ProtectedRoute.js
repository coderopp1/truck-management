import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isLoggedIn, loading, children }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
