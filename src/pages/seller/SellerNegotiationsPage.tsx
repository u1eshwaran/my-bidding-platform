
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNegotiations } from '@/context/NegotiationContext';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

export default function SellerNegotiationsPage() {
  const { getUserNegotiations } = useNegotiations();
  const { getProductById } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const userNegotiations = getUserNegotiations();
  
  // Filter negotiations
  const filteredNegotiations = userNegotiations.filter(negotiation => {
    const product = getProductById(negotiation.productId);
    
    const matchesSearch = product ? 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
      false;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      negotiation.status === statusFilter;
    
    return matchesSearch || !searchTerm ? matchesStatus : false;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-blue-500">
            <MessageSquare size={14} className="mr-1" /> Active
          </Badge>
        );
      case 'accepted':
        return (
          <Badge className="bg-green-500">
            <CheckCircle size={14} className="mr-1" /> Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500">
            <XCircle size={14} className="mr-1" /> Rejected
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-purple-500">
            <CheckCircle size={14} className="mr-1" /> Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="py-8">
      <div className="marketplace-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Negotiations</h1>
          <p className="text-gray-600">
            Manage buyer offers and complete sales
          </p>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {userNegotiations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNegotiations.map(negotiation => {
              const product = getProductById(negotiation.productId);
              if (!product) return null;
              
              return (
                <Link 
                  key={negotiation.id} 
                  to={`/seller/negotiations/${negotiation.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                        {getStatusBadge(negotiation.status)}
                      </div>
                      <CardDescription>
                        Started on {formatDate(negotiation.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Your Price</span>
                          <span className="font-medium">${product.sellerPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Current Offer</span>
                          <span className="font-medium text-marketplace-blue">${negotiation.currentOffer}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Messages</span>
                          <span className="font-medium">{negotiation.messages.length}</span>
                        </div>
                        
                        <div className="pt-2 text-center">
                          <span className="text-sm hover:text-marketplace-blue transition-colors">
                            View Negotiation →
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Negotiations Yet</h3>
            <p className="text-gray-500 mb-6">
              You don't have any active negotiations with buyers
            </p>
            <Link to="/seller/products">
              <Button>
                View My Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
