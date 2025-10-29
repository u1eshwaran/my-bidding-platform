
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, ShieldCheck } from 'lucide-react';

export default function TechnicianVerificationsPage() {
  const { getPendingVerifications } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  
  const pendingVerifications = getPendingVerifications();
  
  // Filter products by search term
  const filteredProducts = pendingVerifications.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="py-8">
      <div className="marketplace-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pending Verifications</h1>
            <p className="text-gray-600">
              Products waiting for your professional assessment
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>
        
        {pendingVerifications.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Expected Price</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden border mr-3">
                          <img 
                            src={product.images.sample || 'https://placehold.co/100?text=No+Image'} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sellerName}</TableCell>
                    <TableCell>${product.sellerPrice}</TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell>
                      <Link to={`/technician/verify/${product.id}`}>
                        <Button size="sm" className="bg-marketplace-teal hover:bg-green-700">
                          <ShieldCheck size={16} className="mr-2" />
                          Verify
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border">
            <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Pending Verifications</h3>
            <p className="text-gray-500">
              All products have been verified. Check back later for new submissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
