import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { getUserByUid } from "@/lib/firestore";
import type { User } from "@shared/schema";

export function useAuth() {
  const [firebaseUser, loading, error] = useAuthState(auth);
  
  const { data: user, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser?.uid) return null;
      return await getUserByUid(firebaseUser.uid);
    },
    enabled: !!firebaseUser?.uid,
  });
  
  return {
    user,
    firebaseUser,
    isLoading: loading || userLoading,
    isAuthenticated: !!firebaseUser && !!user,
    error,
  };
}
