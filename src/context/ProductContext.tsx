
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, UserRole } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  loadingProducts: boolean;
  addProduct: (product: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'sellerName' | 'sellerPhone'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  verifyProduct: (
    productId: string, 
    technicianDescription: string, 
    technicianPrice: number, 
    technicianImages: string[],
    technicianPhone: string
  ) => Promise<void>;
  getUserProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getPendingVerifications: () => Product[];
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 12 Pro',
    details: 'Excellent condition, 128GB, Pacific Blue',
    sellerPrice: 700,
    technicianPrice: 650,
    technicianDescription: 'Minor scratches on back, battery health 92%',
    sellerId: 's1',
    sellerName: 'John Seller',
    sellerPhone: '+1234567890',
    technicianPhone: '+1555123456',
    address: '123 Apple St, Cupertino, CA',
    status: 'verified',
    images: {
      sample: 'https://placehold.co/400x300?text=iPhone+12+Pro+Sample',
      technician: [
        'https://placehold.co/400x300?text=iPhone+Front',
        'https://placehold.co/400x300?text=iPhone+Back',
      ]
    },
    createdAt: '2023-04-01T10:00:00Z',
    updatedAt: '2023-04-02T14:30:00Z'
  },
  {
    id: 'p2',
    name: 'MacBook Air M1',
    details: 'Like new, 256GB SSD, 8GB RAM, Space Gray',
    sellerPrice: 800,
    sellerId: 's1',
    sellerName: 'John Seller',
    sellerPhone: '+1234567890',
    address: '456 Mac Ave, Cupertino, CA',
    status: 'pending',
    images: {
      sample: 'https://placehold.co/400x300?text=MacBook+Sample'
    },
    createdAt: '2023-04-05T15:20:00Z',
    updatedAt: '2023-04-05T15:20:00Z'
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(MOCK_PRODUCTS);
      setLoadingProducts(false);
    };

    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'sellerName' | 'sellerPhone'>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error('You must be logged in to add a product');
      
      const newProduct: Product = {
        ...productData,
        id: `p${products.length + 1}`,
        sellerName: user.name,
        sellerPhone: user.phoneNumber || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProducts(prevProducts => [...prevProducts, newProduct]);
      toast.success('Product submitted for verification!');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add product');
      throw error;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, ...updates, updatedAt: new Date().toISOString() } 
            : product
        )
      );
      
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product');
      throw error;
    }
  };

  const verifyProduct = async (
    productId: string, 
    technicianDescription: string, 
    technicianPrice: number, 
    technicianImages: string[],
    technicianPhone: string
  ) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user || user.role !== 'technician') {
        throw new Error('Only technicians can verify products');
      }
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { 
                ...product, 
                status: 'verified', 
                technicianDescription,
                technicianPrice,
                technicianPhone,
                images: {
                  ...product.images,
                  technician: technicianImages
                },
                updatedAt: new Date().toISOString() 
              } 
            : product
        )
      );
      
      toast.success('Product verified and published!');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to verify product');
      throw error;
    }
  };

  const getUserProducts = () => {
    if (!user) return [];
    
    if (user.role === 'seller') {
      return products.filter(product => product.sellerId === user.id);
    }
    
    return [];
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getPendingVerifications = () => {
    if (!user || user.role !== 'technician') return [];
    return products.filter(product => product.status === 'pending');
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loadingProducts, 
      addProduct, 
      updateProduct, 
      verifyProduct,
      getUserProducts,
      getProductById,
      getPendingVerifications
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
