import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../api'; // ✅ Centralized axios instance

const SellerOrders = () => {
  const { token, userId } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      if (!token) {
        console.warn('No token found');
        return;
      }

      try {
        const res = await api.get('/api/seller/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load seller orders:', err.response?.data || err.message);
      }
    };

    fetchSellerOrders();
  }, [token]);

  const handleMarkShipped = async (orderId, itemId) => {
    try {
      await api.put(
        `/api/seller/orders/${orderId}/items/${itemId}/status`,
        { status: 'Shipped' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('✅ Marked as shipped');

      // Update state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId
                    ? { ...item, shippingStatus: 'Shipped' }
                    : item
                ),
              }
            : order
        )
      );
    } catch (err) {
      console.error('Failed to update shipping status:', err);
      toast.error('❌ Failed to mark as shipped');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📦 Seller Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found for your products.</p>
      ) : (
        orders.map((order) => {
          const sellerItems = order.items?.filter(
            (item) => item.seller?.toString() === userId
          );

          if (!sellerItems || sellerItems.length === 0) return null;

          const sellerTotal = sellerItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <div
              key={order._id}
              className="border rounded p-4 mb-4 bg-white shadow-sm"
            >
              <p>
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-semibold">Buyer:</span>{' '}
                {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <ul className="list-disc ml-5 text-sm">
                {sellerItems.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                    <br />
                    <span className="text-xs text-gray-600">
                      Shipping Status: <strong>{item.shippingStatus}</strong>
                    </span>
                    {item.shippingStatus !== 'Shipped' && (
                      <button
                        onClick={() => handleMarkShipped(order._id, item._id)}
                        className="ml-4 text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        🚚 Mark as Shipped
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <p className="mt-2 font-bold text-green-600">
                Total Earned from this order: ₹{sellerTotal}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SellerOrders;
