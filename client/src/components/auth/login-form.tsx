import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signInWithEmail } from "@/lib/firebase";
import { Link } from "wouter";
import { LogIn, Mail } from "lucide-react";
import { useLocation } from "wouter";
import { createUser } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function LoginForm() {
  const [isLogin, setisLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

    useEffect(() => {
      if (!isLoading && isAuthenticated ) {
        // If user is authenticated and on login page, redirect to dashboard
        setLocation("/dashboard");
      }
    }, [isAuthenticated, isLoading, setLocation]);
    
    if (isLoading) {
      // Optional: show a loading spinner or blank while auth is loading
      return <div>Loading...</div>;
    }

  const handleGoogleLogin = async () => {
    try {
      setisLogin(true);
      const userCredential = await signInWithGoogle();

      await createUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || "",
        firstName: userCredential.user.displayName?.split(" ")[0] || "",
        lastName: userCredential.user.displayName?.split(" ").slice(1).join(" ") || "",
        profileImageUrl: userCredential.user.photoURL || "",
        phone: userCredential.user.phoneNumber || "",
        role: "patient",
      });

      toast({
        title: "Success",
        description: "Logged in successfully with Google!",
      });

      // Remove this line:
      // setLocation("/dashboard");
      
      // Instead rely on Router's useEffect to redirect when auth state updates

    } catch (error: any) {
      // handle errors
    } finally {
      setisLogin(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setisLogin(true);
      await signInWithEmail(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Email login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setisLogin(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to book your dental appointment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLogin}
            className="w-full"
            variant="outline"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isLogin ? "Signing in..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLogin}>
              <Mail className="mr-2 h-4 w-4" />
              {isLogin ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
              Create account here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}