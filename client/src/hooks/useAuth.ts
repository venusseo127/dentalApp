import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, isLoading, error] = useAuthState(auth);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
