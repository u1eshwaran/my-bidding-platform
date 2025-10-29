
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { Search } from 'lucide-react';

export default function HomePage() {
  const { products, loadingProducts } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Get verified products for the featured section
    const verified = products.filter(p => p.status === 'verified').slice(0, 8);
    setFeaturedProducts(verified);
  }, [products]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-marketplace-blue to-blue-700 text-white py-16">
        <div className="marketplace-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">
              Buy and Sell with Confidence
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-slide-in">
              A secure marketplace for verified second-hand products
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <Link to="/products">
                <Button size="lg" className="bg-white text-marketplace-blue hover:bg-gray-100">
                  Browse Products
                </Button>
              </Link>
              <Link to="/auth?tab=register">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-600">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="marketplace-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-marketplace-blue text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Seller Uploads Product</h3>
              <p className="text-gray-600">
                Sellers upload product details, photos, and set their expected price.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-marketplace-teal text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Technician Verifies</h3>
              <p className="text-gray-600">
                Expert technicians inspect, photograph, and provide detailed assessments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-marketplace-amber text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Buyers Purchase</h3>
              <p className="text-gray-600">
                Buyers browse verified products, negotiate prices, and complete purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="marketplace-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-marketplace-blue hover:underline">
              View all products →
            </Link>
          </div>
          
          <ProductGrid 
            products={featuredProducts} 
            loading={loadingProducts}
            emptyMessage="No verified products available yet. Check back soon!"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="marketplace-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join Biddify today to buy and sell with confidence
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?tab=register&role=seller">
                <Button size="lg" className="bg-marketplace-teal hover:bg-green-600 min-w-[200px]">
                  Register as Seller
                </Button>
              </Link>
              <Link to="/auth?tab=register&role=buyer">
                <Button size="lg" className="bg-marketplace-blue hover:bg-blue-600 min-w-[200px]">
                  Register as Buyer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
