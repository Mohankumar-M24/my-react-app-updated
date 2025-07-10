import { useEffect, useState } from 'react';
import api from '../../api'; // ✅ centralized axios instance
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my-orders', {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        toast.error('Failed to load orders');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 mb-6 shadow-sm bg-white"
          >
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Order ID: {order._id}</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              <div>
                <strong>Payment ID:</strong>{' '}
                {order.razorpay_payment_id || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong> {order.status}
              </div>
              <div>
                <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              <strong>Shipping Info:</strong>
              <div>Name: {order.shippingInfo?.name}</div>
              <div>
                Address: {order.shippingInfo?.address},{' '}
                {order.shippingInfo?.city} - {order.shippingInfo?.pincode}
              </div>
              <div>Phone: {order.shippingInfo?.phone}</div>
            </div>

            <div className="mt-2 text-sm">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
