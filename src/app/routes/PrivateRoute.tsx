import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider";
import { Loader } from "@/components/Loader";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullPage />;

  return user ? children : <Navigate to="/login" replace />;
};
