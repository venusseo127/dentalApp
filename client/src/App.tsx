import { useEffect } from "react";
import { Switch, Route,useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Booking from "@/pages/booking";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated && location === "/login") {
      // If user is authenticated and on login page, redirect to dashboard
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  if (isLoading) {
    // Optional: show a loading spinner or blank while auth is loading
    return <div>Loading...</div>;
  }
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/booking" component={Booking} />
      <Route path="/about" component={About} />
      {isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/booking" component={Booking} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
        </>
      ) : (
        <Route path="/" component={Landing} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
