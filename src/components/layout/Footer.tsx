
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="marketplace-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Biddify</h3>
            <p className="text-gray-600 text-sm mb-4">
              A secure platform for buying and selling verified second-hand products.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/u1eshwaran/my-bidding-platform" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=register" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-600 hover:text-marketplace-blue transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2025 Biddify. All rights reserved. Created for Final Year Engineering Project.</p>
          <div className="mt-4 md:mt-0">
            <a href="mailto:contact@biddify.com" className="text-gray-600 hover:text-marketplace-blue transition-colors">contact@biddify.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
