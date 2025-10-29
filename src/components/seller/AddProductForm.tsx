import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader, Upload } from 'lucide-react';

export default function AddProductForm() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [sampleImage, setSampleImage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !details || !price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!phoneNumber) {
      toast.error('Please provide your contact number');
      return;
    }
    
    if (!address) {
      toast.error('Please provide your address');
      return;
    }
    
    const numericPrice = parseFloat(price);
    
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addProduct({
        name,
        details,
        sellerPrice: numericPrice,
        sellerId: user?.id || '',
        address: address,
        images: {
          sample: sampleImage || 'https://placehold.co/400x300?text=No+Image'
        }
      });
      
      navigate('/seller/products');
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSampleImage(reader.result);
          toast.success('Image uploaded successfully!');
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Enter your product details for verification by a technician.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., iPhone 12 Pro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Product Details *</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              placeholder="e.g., 128GB, Pacific Blue, Excellent condition"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Your Price ($) *</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Contact Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="+1234567890"
            />
            <p className="text-xs text-gray-500">This will be shared with the buyer after purchase completion</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your address"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500">This will be used for the product handover</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('image')?.click()}
              >
                <Upload size={16} className="mr-2" />
                Upload Image
              </Button>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {sampleImage && (
                <div className="border rounded-md overflow-hidden w-[100px] h-[100px]">
                  <img 
                    src={sampleImage} 
                    alt="Product preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload a clear image of your product. The technician will take additional photos during verification.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/seller/products')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
