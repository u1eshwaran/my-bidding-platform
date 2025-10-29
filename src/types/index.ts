
export type UserRole = 'seller' | 'buyer' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Product {
  id: string;
  name: string;
  details: string;
  sellerPrice: number;
  technicianPrice?: number;
  technicianDescription?: string;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  technicianPhone?: string;
  address?: string;
  status: 'pending' | 'verified' | 'sold';
  images: {
    sample?: string;
    technician?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Negotiation {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  messages: Message[];
  currentOffer: number;
  status: 'active' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  offerAmount?: number;
  timestamp: string;
}
