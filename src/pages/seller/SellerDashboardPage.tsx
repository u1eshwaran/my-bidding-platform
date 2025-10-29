
import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useNegotiations } from '@/context/NegotiationContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MessageSquare, ShieldCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { getUserProducts } = useProducts();
  const { getUserNegotiations } = useNegotiations();
  
  const userProducts = getUserProducts();
  const userNegotiations = getUserNegotiations();
  
  const pendingProducts = userProducts.filter(p => p.status === 'pending').length;
  const verifiedProducts = userProducts.filter(p => p.status === 'verified').length;
  const activeNegotiations = userNegotiations.filter(n => n.status === 'active').length;

  return (
    <div className="py-8">
      <div className="marketplace-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/seller/add-product">
              <Button>
                <Package size={18} className="mr-2" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Products</CardTitle>
              <Package size={18} className="text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userProducts.length}</p>
              <p className="text-sm text-gray-500 mt-1">Products in your inventory</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Active Negotiations</CardTitle>
              <MessageSquare size={18} className="text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeNegotiations}</p>
              <p className="text-sm text-gray-500 mt-1">Ongoing buyer negotiations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Verification Status</CardTitle>
              <ShieldCheck size={18} className="text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm font-medium">Verified: {verifiedProducts}</span>
                  </div>
                  <div className="flex items-center text-yellow-600 mt-1">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm font-medium">Pending: {pendingProducts}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {userProducts.length > 0 
                    ? Math.round((verifiedProducts / userProducts.length) * 100) 
                    : 0}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Your most recently added products</CardDescription>
            </CardHeader>
            <CardContent>
              {userProducts.length > 0 ? (
                <div className="space-y-4">
                  {userProducts.slice(0, 5).map(product => (
                    <Link 
                      key={product.id} 
                      to={`/products/${product.id}`} 
                      className="block"
                    >
                      <div className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                        <div className="h-12 w-12 rounded-md overflow-hidden border mr-3">
                          <img 
                            src={product.images.technician?.[0] || product.images.sample || 'https://placehold.co/100?text=No+Image'} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.sellerPrice}</p>
                        </div>
                        <div>
                          {product.status === 'verified' ? (
                            <ShieldCheck size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">You haven't added any products yet</p>
                  <Link to="/seller/add-product">
                    <Button variant="outline" className="mt-4">
                      Add Your First Product
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Negotiations</CardTitle>
              <CardDescription>Your active buyer negotiations</CardDescription>
            </CardHeader>
            <CardContent>
              {userNegotiations.length > 0 ? (
                <div className="space-y-4">
                  {userNegotiations.slice(0, 5).map(negotiation => {
                    const product = userProducts.find(p => p.id === negotiation.productId);
                    return (
                      <Link 
                        key={negotiation.id} 
                        to={`/seller/negotiations/${negotiation.id}`} 
                        className="block"
                      >
                        <div className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                          <div className="h-12 w-12 rounded-md overflow-hidden border mr-3">
                            <img 
                              src={product?.images.technician?.[0] || product?.images.sample || 'https://placehold.co/100?text=No+Image'} 
                              alt={product?.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product?.name}</p>
                            <p className="text-sm text-gray-500">Current offer: ${negotiation.currentOffer}</p>
                          </div>
                          <div>
                            {negotiation.status === 'active' ? (
                              <MessageSquare size={16} className="text-blue-500" />
                            ) : (
                              <CheckCircle size={16} className="text-green-500" />
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No active negotiations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
