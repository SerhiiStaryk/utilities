import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};
