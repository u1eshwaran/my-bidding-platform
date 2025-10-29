
import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const { products, getPendingVerifications } = useProducts();
  
  const pendingVerifications = getPendingVerifications();
  const verifiedProducts = products.filter(p => p.status === 'verified').length;
  const totalProducts = products.length;
  const verificationRate = totalProducts > 0 ? (verifiedProducts / totalProducts * 100).toFixed(0) : 0;

  return (
    <div className="py-8">
      <div className="marketplace-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/technician/verifications">
              <Button className="bg-marketplace-teal hover:bg-green-700">
                <Clock size={18} className="mr-2" />
                Pending Verifications
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Pending Verifications</CardTitle>
              <Clock size={18} className="text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingVerifications.length}</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting your review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Verified Products</CardTitle>
              <ShieldCheck size={18} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{verifiedProducts}</p>
              <p className="text-sm text-gray-500 mt-1">Products you've verified</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Verification Rate</CardTitle>
              <CheckCircle size={18} className="text-marketplace-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{verificationRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Platform verification rate</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Pending Verifications</CardTitle>
            <CardDescription>Products awaiting your verification</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingVerifications.length > 0 ? (
              <div className="space-y-4">
                {pendingVerifications.slice(0, 5).map(product => (
                  <Link 
                    key={product.id} 
                    to={`/technician/verify/${product.id}`} 
                    className="block"
                  >
                    <div className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                      <div className="h-12 w-12 rounded-md overflow-hidden border mr-3">
                        <img 
                          src={product.images.sample || 'https://placehold.co/100?text=No+Image'} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">Expected: ${product.sellerPrice}</p>
                      </div>
                      <div>
                        <Button size="sm" className="bg-marketplace-teal hover:bg-green-700">
                          Verify
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No pending verifications</p>
                <p className="text-sm text-gray-400 mt-2">
                  All products have been verified. Great job!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
