import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextValue {
  user: User | null;
  role: string | null;
  allowedAddresses: string[] | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  allowedAddresses: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [allowedAddresses, setAllowedAddresses] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role || null);
            setAllowedAddresses(userData.allowedAddresses || []);
          } else {
            console.warn("No user document found in 'users' collection for UID:", currentUser.uid);
            setRole(null);
            setAllowedAddresses([]);
          }
        } catch (error) {
          setRole(null);
          setAllowedAddresses([]);
        }
      } else {
        setRole(null);
        setAllowedAddresses(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, allowedAddresses, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
