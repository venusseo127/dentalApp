import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function LogoutButton({ variant = "outline", size = "default", className }: LogoutButtonProps) {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleLogout} variant={variant} size={size} className={className}>
      Sign Out
    </Button>
  );
}