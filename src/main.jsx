import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from './contexts/WishlistContext';

import axios from 'axios'; 
axios.defaults.withCredentials = true; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WishlistProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </WishlistProvider>
  </React.StrictMode>
);
