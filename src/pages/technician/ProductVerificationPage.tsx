
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import VerificationForm from '@/components/technician/VerificationForm';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ProductVerificationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <div className="py-8">
        <div className="marketplace-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/technician/verifications')}>
              Back to Verifications
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (product.status !== 'pending') {
    return (
      <div className="py-8">
        <div className="marketplace-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Already Verified</h1>
            <p className="text-gray-600 mb-4">This product has already been verified and is no longer pending review.</p>
            <Button onClick={() => navigate('/technician/verifications')}>
              Back to Verifications
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
            onClick={() => navigate('/technician/verifications')}
          >
            Back to Pending Verifications
          </Button>
        </div>
        
        <VerificationForm product={product} />
      </div>
    </div>
  );
}
