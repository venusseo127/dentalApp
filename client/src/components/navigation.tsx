import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Calendar, Settings } from "lucide-react";
import { Link } from "wouter";
import LogoutButton from "@/components/auth/logout-button";
import LoginButton from "@/components/auth/login-button";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-tooth text-primary-500 text-2xl mr-2"></i>
                <span className="font-bold text-xl text-secondary-900">DentalCare</span>
              </div>
            </Link>
            {isAuthenticated && (
              <div className="hidden md:block ml-10">
                <div className="flex space-x-8">
                  <Link href="/" className="text-secondary-900 hover:text-primary-500 font-medium">
                    Home
                  </Link>
                  <Link href="/booking" className="text-secondary-900 hover:text-primary-500 font-medium">
                    Book Appointment
                  </Link>
                  <Link href="/dashboard" className="text-secondary-900 hover:text-primary-500 font-medium">
                    Dashboard
                  </Link>
                  {user?.email === 'admin@example.com' && (
                    <Link href="/admin" className="text-secondary-900 hover:text-primary-500 font-medium">
                      Admin
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <LoginButton />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <LogoutButton variant="ghost" className="w-full justify-start p-0" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}