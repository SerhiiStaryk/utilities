import { auth } from "./firebase.config";
import { signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName, photoURL });
  }
};
