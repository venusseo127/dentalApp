import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "wouter";

export default function LoginButton() {
  return (
    <Link href="/login">
      <Button className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>
    </Link>
  );
}