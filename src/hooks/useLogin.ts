import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as firebaseLogin } from "../firebase/auth";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseLogin(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
