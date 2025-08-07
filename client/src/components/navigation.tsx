import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Calendar, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";

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
                  {user?.role === 'admin' && (
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
              <>
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = "/api/login"}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Login
                </Button>
                <Button
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium"
                >
                  Book Appointment
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <img
                      src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden md:inline text-secondary-900">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/booking" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => window.location.href = "/api/logout"}
                    className="flex items-center text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
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
