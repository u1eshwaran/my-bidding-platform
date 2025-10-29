
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNegotiations } from '@/context/NegotiationContext';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import NegotiationChat from '@/components/negotiation/NegotiationChat';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function BuyerNegotiationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNegotiationById } = useNegotiations();
  const { getProductById } = useProducts();
  const { user } = useAuth();
  
  const negotiation = getNegotiationById(id || '');
  
  if (!negotiation) {
    return (
      <div className="py-8">
        <div className="marketplace-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Negotiation Not Found</h1>
            <p className="text-gray-600 mb-4">The negotiation you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/buyer/negotiations')}>
              Back to Negotiations
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const product = getProductById(negotiation.productId);
  
  if (!product) {
    return (
      <div className="py-8">
        <div className="marketplace-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">The product associated with this negotiation cannot be found.</p>
            <Button onClick={() => navigate('/buyer/negotiations')}>
              Back to Negotiations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="marketplace-container">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/buyer/negotiations')}
          >
            Back to Negotiations
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-medium">Product Info</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex-shrink-0 mb-4">
                  <img 
                    src={product.images.technician?.[0] || product.images.sample || 'https://placehold.co/400x300?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-48 object-contain border rounded"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Product Name</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Seller's Price</p>
                  <p className="font-medium">${product.sellerPrice}</p>
                </div>
                
                {product.technicianPrice && (
                  <div>
                    <p className="text-sm text-gray-500">Technician's Estimate</p>
                    <p className="font-medium">${product.technicianPrice}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Your Current Offer</p>
                  <p className="font-medium text-marketplace-blue">${negotiation.currentOffer}</p>
                </div>

                {negotiation.status === 'completed' && (
                  <div className="bg-green-50 p-4 rounded-md text-center">
                    <p className="font-medium text-green-700">Purchase Completed!</p>
                    <p className="text-sm text-green-600 mt-1">Contact details available in chat</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
              <NegotiationChat 
                negotiation={negotiation} 
                product={product}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
