
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Package, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBasedLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'seller':
        return (
          <>
            <Link to="/seller/dashboard" className="hover:text-marketplace-blue transition-colors">
              Dashboard
            </Link>
            <Link to="/seller/products" className="hover:text-marketplace-blue transition-colors">
              My Products
            </Link>
            <Link to="/seller/negotiations" className="hover:text-marketplace-blue transition-colors">
              Negotiations
            </Link>
          </>
        );
      case 'buyer':
        return (
          <>
            <Link to="/products" className="hover:text-marketplace-blue transition-colors">
              Products
            </Link>
            <Link to="/buyer/negotiations" className="hover:text-marketplace-blue transition-colors">
              My Negotiations
            </Link>
          </>
        );
      case 'technician':
        return (
          <>
            <Link to="/technician/dashboard" className="hover:text-marketplace-blue transition-colors">
              Dashboard
            </Link>
            <Link to="/technician/verifications" className="hover:text-marketplace-blue transition-colors">
              Pending Verifications
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="marketplace-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-marketplace-blue">
              Biddify
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6 ml-10">
                {getRoleBasedLinks()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 bg-muted">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="cursor-pointer md:hidden">
                    {/* Mobile navigation links */}
                    {getRoleBasedLinks()}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate(`/${user?.role}/profile`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  {user?.role === 'seller' && (
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/seller/add-product')}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <span>Add Product</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate('/auth?tab=register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
