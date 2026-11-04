import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";
import { auth, firebaseStore } from "@/integrations/firebase/client";

interface AuthContextValue {
  user: User | null;
  session: { user: User } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = firebaseStore.auth.onAuthStateChange((_event, nextUser) => {
      setUser(nextUser);
      setLoading(false);
    }).data.subscription;
    return unsubscribe;
  }, []);
  const signOut = async () => { await firebaseStore.auth.signOut(); };
  return <AuthContext.Provider value={{ user, session: user ? { user } : null, loading, signOut }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
