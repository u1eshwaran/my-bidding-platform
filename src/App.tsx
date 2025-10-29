
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { NegotiationProvider } from "@/context/NegotiationContext";

// Layout
import Layout from "./components/layout/Layout";

// Public Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";

// Seller Pages
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import AddProductPage from "./pages/seller/AddProductPage";
import SellerNegotiationsPage from "./pages/seller/SellerNegotiationsPage";
import SellerNegotiationPage from "./pages/seller/SellerNegotiationPage";

// Buyer Pages
import BuyerNegotiationsPage from "./pages/buyer/BuyerNegotiationsPage";
import BuyerNegotiationPage from "./pages/buyer/BuyerNegotiationPage";

// Technician Pages
import TechnicianDashboardPage from "./pages/technician/TechnicianDashboardPage";
import TechnicianVerificationsPage from "./pages/technician/TechnicianVerificationsPage";
import ProductVerificationPage from "./pages/technician/ProductVerificationPage";

// Route Guard Component
import { useAuth } from "./context/AuthContext";
import { UserRole } from "./types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case 'seller':
        return <Navigate to="/seller/dashboard" replace />;
      case 'buyer':
        return <Navigate to="/products" replace />;
      case 'technician':
        return <Navigate to="/technician/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      
      {/* Seller Routes */}
      <Route 
        path="/seller/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/seller/products" 
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerProductsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/seller/add-product" 
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <AddProductPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/seller/negotiations" 
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerNegotiationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/seller/negotiations/:id" 
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerNegotiationPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Buyer Routes */}
      <Route 
        path="/buyer/negotiations" 
        element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerNegotiationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/buyer/negotiations/:id" 
        element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerNegotiationPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Technician Routes */}
      <Route 
        path="/technician/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <TechnicianDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/technician/verifications" 
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <TechnicianVerificationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/technician/verify/:id" 
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <ProductVerificationPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>
          <NegotiationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </NegotiationProvider>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
