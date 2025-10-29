
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNegotiations } from '@/context/NegotiationContext';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Negotiation, Product } from '@/types';
import { DollarSign, Send, X, Phone } from 'lucide-react';

interface NegotiationChatProps {
  negotiation: Negotiation;
  product: Product;
}

export default function NegotiationChat({ negotiation, product }: NegotiationChatProps) {
  const { user } = useAuth();
  const { sendMessage, acceptOffer, completePurchase } = useNegotiations();
  const { getProductById } = useProducts();
  
  const [message, setMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState<number | null>(null);
  const [manualOffer, setManualOffer] = useState<string>('');
  const [showManualOffer, setShowManualOffer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isSeller = user?.role === 'seller';
  const isBuyer = user?.role === 'buyer';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [negotiation.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && offerAmount === null) return;
    
    setIsSubmitting(true);
    
    try {
      await sendMessage(
        negotiation.id, 
        message || (offerAmount ? `I offer $${offerAmount} for this item.` : ''),
        offerAmount || undefined
      );
      
      setMessage('');
      setOfferAmount(null);
      setShowManualOffer(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      await acceptOffer(negotiation.id);
    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  const handleCompletePurchase = async () => {
    if (negotiation.status !== 'accepted') return;
    
    try {
      await completePurchase(negotiation.id);
    } catch (error) {
      console.error('Failed to complete purchase:', error);
    }
  };

  const handleManualOfferSubmit = () => {
    const numericOffer = parseFloat(manualOffer);
    if (!isNaN(numericOffer) && numericOffer > 0) {
      setOfferAmount(numericOffer);
      setShowManualOffer(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b p-4">
        <h3 className="font-medium">Negotiation for {product.name}</h3>
        <p className="text-sm text-gray-500">Current offer: ${negotiation.currentOffer}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {negotiation.messages.map((msg) => {
          const isSentByMe = msg.senderId === user?.id;
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  isSentByMe 
                    ? 'bg-marketplace-blue text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <div className="flex flex-col">
                  <div className="text-xs mb-1">
                    {!isSentByMe && (
                      <span className="font-medium capitalize">
                        {msg.senderRole} • 
                      </span>
                    )}
                    <span className="opacity-75 ml-1">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                  
                  <p>{msg.content}</p>
                  
                  {msg.offerAmount && (
                    <div className={`mt-2 p-2 rounded ${
                      isSentByMe ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <p className={`text-sm font-medium flex items-center ${
                        isSentByMe ? 'text-white' : 'text-gray-800'
                      }`}>
                        <DollarSign size={14} className="mr-1" />
                        Offer: ${msg.offerAmount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Contact Information in Chat when completed */}
        {negotiation.status === 'completed' && (
          <div className="border border-green-200 rounded-lg p-4 bg-green-50 my-4">
            <div className="text-center mb-2">
              <h4 className="font-medium text-green-700">Purchase Completed!</h4>
              <p className="text-sm text-green-600">Contact information has been shared with both parties.</p>
            </div>
            
            <div className="space-y-3 mt-3">
              {isBuyer && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Seller Contact:</p>
                  <div className="flex items-center mt-1 bg-white p-2 rounded">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    <span>{product.sellerPhone || "Phone number not available"}</span>
                  </div>
                </div>
              )}
              
              {isSeller && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Buyer Contact:</p>
                  <div className="flex items-center mt-1 bg-white p-2 rounded">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    <span>{user?.phoneNumber || "Phone number not available"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {negotiation.status === 'active' && (
        <>
          <Separator />
          
          {offerAmount !== null && (
            <div className="p-3 bg-blue-50 border-b">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">Making an offer: </span>
                  ${offerAmount}
                </p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setOfferAmount(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {showManualOffer && (
            <div className="p-3 bg-blue-50 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="number"
                    value={manualOffer}
                    onChange={(e) => setManualOffer(e.target.value)}
                    className="pl-8"
                    placeholder="Enter offer amount"
                  />
                </div>
                <Button onClick={handleManualOfferSubmit} size="sm">
                  Set Offer
                </Button>
                <Button 
                  onClick={() => setShowManualOffer(false)} 
                  size="sm" 
                  variant="ghost"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="flex-1">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSubmitting}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || (!message && offerAmount === null)}
              >
                <Send size={18} />
              </Button>
            </form>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {isBuyer && negotiation.status === 'active' && !showManualOffer && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualOffer(true)}
                >
                  <DollarSign size={14} className="mr-1" />
                  Make Offer
                </Button>
              )}
              
              {isSeller && negotiation.status === 'active' && !showManualOffer && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualOffer(true)}
                >
                  <DollarSign size={14} className="mr-1" />
                  Counter Offer
                </Button>
              )}
              
              {isSeller && negotiation.status === 'active' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAcceptOffer}
                >
                  Accept Current Offer
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      
      {negotiation.status === 'accepted' && (
        <div className="p-4 bg-green-50 border-t text-center">
          <p className="text-green-700 font-medium">Offer accepted!</p>
          {isBuyer && (
            <Button 
              className="mt-2 bg-marketplace-amber" 
              onClick={handleCompletePurchase}
            >
              Complete Purchase
            </Button>
          )}
        </div>
      )}

      {negotiation.status === 'completed' && (
        <div className="p-4 bg-green-50 border-t text-center">
          <p className="text-green-700 font-medium">Purchase completed!</p>
          <p className="text-sm text-green-600 mt-1">Contact information has been shared in the chat above.</p>
        </div>
      )}
    </div>
  );
}
