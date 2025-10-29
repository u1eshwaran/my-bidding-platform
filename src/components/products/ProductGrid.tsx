
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Loader } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  emptyMessage = 'No products found' 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="animate-spin mr-2" />
        <span>Loading products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-16 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
