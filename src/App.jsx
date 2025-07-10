import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import SidebarLayout from './components/SidebarLayout';
import ProtectedRoute from './components/ProtectedRoute';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Cart from './pages/buyer/Cart';
import Checkout from './pages/Checkout';

import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/AddProduct';
import SellerProductList from './pages/SellerProductList';
import EditProduct from './pages/seller/EditProduct';
import SellerOrders from './pages/seller/SellerOrders';
import SellerStore from './pages/seller/SellerStore';

import BuyerDashboard from './pages/BuyerDashboard';
import OrderHistory from './pages/buyer/OrderHistory';
import ProfileSettings from './pages/ProfileSettings';
import Wishlist from './pages/buyer/Wishlist';
import ProductDetails from './pages/buyer/ProductDetails'; 

function App() {
  const { isLoggedIn, role } = useContext(AuthContext);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    axios.get('https://backend-new-2-6l36.onrender.com/api/health')
      .then(() => console.log(' Frontend connected to backend'))
      .catch((err) => {
        console.error(' Backend connection failed:', err);
        toast.error('❌ Failed to connect to backend');
      });
  }, []);

  return (
    <Router>
      <Navbar key={`${isLoggedIn}-${role}`} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          {/*  Product details route */}
          <Route path="product/:id" element={<ProductDetails />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Seller Dashboard Routes */}
        <Route path="/dashboard" element={<SidebarLayout />}>
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-product"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-products"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-product"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="store"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerStore />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Buyer Dashboard Routes */}
        <Route path="/dashboard/buyer" element={<SidebarLayout />}>
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
