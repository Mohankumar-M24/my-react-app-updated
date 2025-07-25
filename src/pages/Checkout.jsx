import { useState, useContext } from 'react';
import api from '../api';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, totalPrice, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return toast.warning('🛒 Cart is empty');

    const { name, address, city, pincode, phone, email } = shipping;
    if (!name || !address || !city || !pincode || !phone || !email) {
      return toast.error('📦 Please fill all shipping fields');
    }

    try {
      const razorpayRes = await api.post('/api/payments/create-order', {
        amount: totalPrice,
      });

      const { order } = razorpayRes.data;

      const options = {
        key: 'rzp_test_edEb6O2SLmxOzh', // Replace if needed
        amount: order.amount,
        currency: order.currency,
        name: 'E-Commerce Checkout',
        description: 'Payment for cart items',
        order_id: order.id,
        handler: async function (response) {
          try {
            const saveRes = await api.post(
              '/api/orders',
              {
                orderItems: cart.map((item) => ({
                  product: item._id,
                  quantity: item.quantity,
                })),
                totalPrice,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                shippingInfo: shipping,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );

            if (saveRes.status === 201) {
              toast.success('✅ Payment & Order Placed!');
              localStorage.removeItem('cart');
              setCart([]);
              navigate('/dashboard/buyer/orders');
            }
          } catch (err) {
            console.error(' Order saving failed:', err);
            toast.error('❌ Payment succeeded but order failed to save');
          }
        },
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(' Razorpay order creation failed:', err);
      toast.error('❌ Payment initiation failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Shipping Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['name', 'phone', 'email', 'address', 'city', 'pincode'].map((field) => (
          <input
            key={field}
            type={field === 'email' ? 'email' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={shipping[field]}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        ))}
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-4 space-y-2">
            {cart.map((item) => (
              <li key={item._id} className="border-b pb-2">
                {item.name} × {item.quantity} – ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>

          <p className="font-semibold text-right mb-4">
            Total: ₹{totalPrice.toFixed(2)}
          </p>

          <button
            onClick={handlePlaceOrder}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
