
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useNegotiations } from '@/context/NegotiationContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Clock, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { startNegotiation } = useNegotiations();
  const { user, isAuthenticated } = useAuth();
  
  const [initialOffer, setInitialOffer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle size={48} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>
          Browse All Products
        </Button>
      </div>
    );
  }
  
  const { name, details, sellerPrice, technicianPrice, technicianDescription, status, images } = product;
  
  const allImages = [
    ...(images.technician || []),
    ...(images.sample ? [images.sample] : [])
  ];
  
  const handleStartNegotiation = async () => {
    if (!isAuthenticated) {
      toast.error('Please login as a buyer to start negotiation');
      navigate('/auth');
      return;
    }
    
    if (user?.role !== 'buyer') {
      toast.error('Only buyers can start negotiations');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const offerAmount = initialOffer ? parseFloat(initialOffer) : sellerPrice;
      const negotiationId = await startNegotiation(product.id, product.sellerId, offerAmount);
      setIsDialogOpen(false);
      toast.success('Negotiation started successfully!');
      navigate(`/buyer/negotiations/${negotiationId}`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to start negotiation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-500 text-white">
            <ShieldCheck size={14} className="mr-1" /> Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock size={14} className="mr-1" /> Pending Verification
          </Badge>
        );
      case 'sold':
        return (
          <Badge className="bg-red-500 text-white">Sold</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      <div className="marketplace-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {allImages.length > 0 ? (
              <Carousel className="w-full max-w-lg mx-auto">
                <CarouselContent>
                  {allImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="bg-white rounded-lg overflow-hidden border">
                          <img
                            src={image}
                            alt={`${name} - image ${index + 1}`}
                            className="w-full h-[300px] object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="bg-gray-100 h-[300px] rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {renderStatusBadge()}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Seller's Price</p>
                <p className="text-2xl font-bold text-marketplace-blue">${sellerPrice}</p>
              </div>
              
              {technicianPrice && (
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Technician's Estimate</p>
                  <p className="text-2xl font-bold text-marketplace-teal">${technicianPrice}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{details}</p>
              </div>
              
              {technicianDescription && (
                <div>
                  <h3 className="font-semibold mb-2">Technician's Assessment</h3>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="text-gray-700">{technicianDescription}</p>
                  </div>
                </div>
              )}
            </div>
            
            {status === 'verified' && user?.role === 'buyer' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full">
                    <MessageSquare size={18} className="mr-2" />
                    Negotiate with Seller
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start Negotiation</DialogTitle>
                    <DialogDescription>
                      Make an offer to the seller for this product.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Product</p>
                      <p>{name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Seller's Price</p>
                      <p className="font-semibold">${sellerPrice}</p>
                    </div>
                    
                    <div>
                      <label htmlFor="offer" className="text-sm font-medium mb-1 block">
                        Your Initial Offer
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          id="offer"
                          type="number"
                          placeholder={sellerPrice.toString()}
                          value={initialOffer}
                          onChange={(e) => setInitialOffer(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Leave blank to start with the seller's asking price
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStartNegotiation}
                      disabled={isSubmitting}
                    >
                      Start Negotiation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            {status === 'verified' && !isAuthenticated && (
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Log in to Negotiate
              </Button>
            )}
            
            {status === 'verified' && user?.role === 'seller' && (
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <p>You are logged in as a seller. Only buyers can negotiate for products.</p>
              </div>
            )}
            
            {status === 'verified' && user?.role === 'technician' && (
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <p>You are logged in as a technician. Only buyers can negotiate for products.</p>
              </div>
            )}
            
            {status === 'pending' && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-center text-yellow-700">
                  This product is waiting for technician verification
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
