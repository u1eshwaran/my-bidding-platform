
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Negotiation, Message, UserRole } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface NegotiationContextType {
  negotiations: Negotiation[];
  loadingNegotiations: boolean;
  startNegotiation: (productId: string, sellerId: string, initialOffer: number) => Promise<string>;
  sendMessage: (negotiationId: string, content: string, offerAmount?: number) => Promise<void>;
  acceptOffer: (negotiationId: string) => Promise<void>;
  completePurchase: (negotiationId: string) => Promise<void>;
  getUserNegotiations: () => Negotiation[];
  getNegotiationById: (id: string) => Negotiation | undefined;
}

const MOCK_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'n1',
    productId: 'p1',
    buyerId: 'b1',
    sellerId: 's1',
    messages: [
      {
        id: 'm1',
        senderId: 'b1',
        senderRole: 'buyer',
        content: 'I\'m interested in your iPhone. Would you accept $650?',
        offerAmount: 650,
        timestamp: '2023-04-03T09:15:00Z'
      },
      {
        id: 'm2',
        senderId: 's1',
        senderRole: 'seller',
        content: 'I can do $680, it\'s in great condition.',
        offerAmount: 680,
        timestamp: '2023-04-03T10:20:00Z'
      }
    ],
    currentOffer: 680,
    status: 'active',
    createdAt: '2023-04-03T09:15:00Z',
    updatedAt: '2023-04-03T10:20:00Z'
  }
];

const NegotiationContext = createContext<NegotiationContextType | undefined>(undefined);

export const NegotiationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loadingNegotiations, setLoadingNegotiations] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNegotiations = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNegotiations(MOCK_NEGOTIATIONS);
      setLoadingNegotiations(false);
    };

    fetchNegotiations();
  }, []);

  const startNegotiation = async (productId: string, sellerId: string, initialOffer: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error('You must be logged in to start a negotiation');
      if (user.role !== 'buyer') throw new Error('Only buyers can start negotiations');
      
      const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: user.id,
        senderRole: 'buyer',
        content: `I'm interested in this product. My offer is $${initialOffer}.`,
        offerAmount: initialOffer,
        timestamp: new Date().toISOString()
      };
      
      const newNegotiation: Negotiation = {
        id: `n${negotiations.length + 1}`,
        productId,
        buyerId: user.id,
        sellerId,
        messages: [newMessage],
        currentOffer: initialOffer,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNegotiations(prevNegotiations => [...prevNegotiations, newNegotiation]);
      toast.success('Negotiation started!');
      
      return newNegotiation.id;
    } catch (error) {
      toast.error((error as Error).message || 'Failed to start negotiation');
      throw error;
    }
  };

  const sendMessage = async (negotiationId: string, content: string, offerAmount?: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error('You must be logged in to send messages');
      
      const negotiation = negotiations.find(n => n.id === negotiationId);
      if (!negotiation) throw new Error('Negotiation not found');
      
      if (![negotiation.buyerId, negotiation.sellerId].includes(user.id)) {
        throw new Error('You are not part of this negotiation');
      }
      
      const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: user.id,
        senderRole: user.role as UserRole,
        content,
        offerAmount,
        timestamp: new Date().toISOString()
      };
      
      setNegotiations(prevNegotiations => 
        prevNegotiations.map(n => 
          n.id === negotiationId 
            ? { 
                ...n, 
                messages: [...n.messages, newMessage],
                currentOffer: offerAmount || n.currentOffer,
                updatedAt: new Date().toISOString() 
              } 
            : n
        )
      );
    } catch (error) {
      toast.error((error as Error).message || 'Failed to send message');
      throw error;
    }
  };

  const acceptOffer = async (negotiationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error('You must be logged in to accept an offer');
      
      const negotiation = negotiations.find(n => n.id === negotiationId);
      if (!negotiation) throw new Error('Negotiation not found');
      
      if (user.role === 'seller' && user.id !== negotiation.sellerId) {
        throw new Error('Only the seller can accept this offer');
      }
      
      setNegotiations(prevNegotiations => 
        prevNegotiations.map(n => 
          n.id === negotiationId 
            ? { 
                ...n, 
                status: 'accepted',
                updatedAt: new Date().toISOString() 
              } 
            : n
        )
      );
      
      toast.success('Offer accepted!');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to accept offer');
      throw error;
    }
  };

  const completePurchase = async (negotiationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error('You must be logged in to complete a purchase');
      
      const negotiation = negotiations.find(n => n.id === negotiationId);
      if (!negotiation) throw new Error('Negotiation not found');
      
      if (user.role === 'buyer' && user.id !== negotiation.buyerId) {
        throw new Error('Only the buyer can complete this purchase');
      }
      
      setNegotiations(prevNegotiations => 
        prevNegotiations.map(n => 
          n.id === negotiationId 
            ? { 
                ...n, 
                status: 'completed',
                updatedAt: new Date().toISOString() 
              } 
            : n
        )
      );
      
      toast.success('Purchase completed! Contact information has been shared.');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to complete purchase');
      throw error;
    }
  };

  const getUserNegotiations = () => {
    if (!user) return [];
    
    return negotiations.filter(n => 
      (user.role === 'buyer' && n.buyerId === user.id) || 
      (user.role === 'seller' && n.sellerId === user.id)
    );
  };

  const getNegotiationById = (id: string) => {
    return negotiations.find(n => n.id === id);
  };

  return (
    <NegotiationContext.Provider value={{ 
      negotiations, 
      loadingNegotiations, 
      startNegotiation, 
      sendMessage, 
      acceptOffer,
      completePurchase,
      getUserNegotiations,
      getNegotiationById
    }}>
      {children}
    </NegotiationContext.Provider>
  );
};

export const useNegotiations = (): NegotiationContextType => {
  const context = useContext(NegotiationContext);
  if (context === undefined) {
    throw new Error('useNegotiations must be used within a NegotiationProvider');
  }
  return context;
};
