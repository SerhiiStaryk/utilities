import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { Loader } from "../../components/Loader";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullPage />;

  return user ? children : <Navigate to="/login" replace />;
};
