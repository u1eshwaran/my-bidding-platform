
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Loader, Plus, Trash2, Upload, Phone, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface VerificationFormProps {
  product: Product;
}

export default function VerificationForm({ product }: VerificationFormProps) {
  const navigate = useNavigate();
  const { verifyProduct } = useProducts();
  const { user } = useAuth();
  
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result]);
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await verifyProduct(
        product.id,
        description,
        parseFloat(price),
        images,
        user?.phoneNumber || ''
      );
      
      toast.success('Product verified and published successfully!');
      navigate('/technician/verifications');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to verify product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify Product: {product.name}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original product info */}
            <div className="space-y-4">
              <h3 className="font-medium">Seller Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Product Name</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Product Details</p>
                  <p>{product.details}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Expected Selling Price</p>
                  <p className="font-medium">${product.sellerPrice}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Seller Contact</p>
                  <p className="flex items-center">
                    <Phone size={14} className="mr-1 text-gray-500" />
                    {product.sellerPhone || "Not provided"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Product Address</p>
                  <p className="flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-500" />
                    {product.address || "Not provided"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Seller Sample Image</p>
                  {product.images.sample ? (
                    <img 
                      src={product.images.sample} 
                      alt="Seller provided sample" 
                      className="w-full h-48 object-contain border rounded mt-1" 
                    />
                  ) : (
                    <p className="italic text-gray-500">No sample image provided</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Technician verification form */}
            <div className="space-y-4">
              <h3 className="font-medium">Technician Verification</h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="description">Professional Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed technical assessment of the product..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="techPrice">Estimated Market Price ($)</Label>
                  <Input
                    id="techPrice"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Product Photos</Label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative border rounded overflow-hidden h-24">
                        <img 
                          src={img} 
                          alt={`Product photo ${index + 1}`} 
                          className="w-full h-full object-contain" 
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    
                    <div>
                      <Input
                        id="newImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="newImage" 
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded h-24 cursor-pointer hover:bg-gray-50"
                      >
                        <Plus size={18} className="text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Add photo</span>
                      </label>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Upload multiple clear photos of the product from different angles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4 border-t p-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/technician/verifications')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button type="submit" className="bg-marketplace-teal hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" /> Processing...
              </>
            ) : 'Verify & Publish Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
