
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, images, technicianPrice, sellerPrice, status } = product;
  
  const displayImage = images.technician?.[0] || images.sample || 'https://placehold.co/400x300?text=No+Image';
  
  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="absolute top-2 right-2 bg-green-500">
            <ShieldCheck size={14} className="mr-1" /> Verified
          </Badge>
        );
      case 'pending':
        return <Badge className="absolute top-2 right-2 bg-yellow-500">Pending</Badge>;
      case 'sold':
        return <Badge className="absolute top-2 right-2 bg-red-500">Sold</Badge>;
      default:
        return null;
    }
  };

  return (
    <Link to={`/products/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={displayImage} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {getStatusBadge()}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg truncate">{name}</h3>
          
          <div className="mt-2 flex flex-col">
            {technicianPrice && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Technician Est.</span>
                <span className="font-medium">${technicianPrice}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Seller Price</span>
              <span className="font-semibold text-marketplace-blue">${sellerPrice}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t border-gray-100">
          <div className="w-full text-center">
            <span className="text-sm text-gray-500 hover:text-marketplace-blue transition-colors">
              View Details →
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
