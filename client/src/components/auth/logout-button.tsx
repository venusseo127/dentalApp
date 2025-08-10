import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

// Using forwardRef to support ref forwarding
const LogoutButton = React.forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ variant = "outline", size = "default", className }, ref) => {
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    const handleLogout = async () => {
      try {
        await signOut(auth);
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        setLocation("/");
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
      <Button
        ref={ref}
        onClick={handleLogout}
        variant={variant}
        size={size}
        className={className}
      >
        Sign Out
      </Button>
    );
  }
);

// For better debugging
LogoutButton.displayName = "LogoutButton";

export default LogoutButton;