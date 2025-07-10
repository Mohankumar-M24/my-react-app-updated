import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();

  // confirms component is mounted
  useEffect(() => {
    //console.log(" OrderHistory component mounted");
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        console.warn(' No token found in context');
        return;
      }

      try {
        //console.log(' Sending token from OrderHistory:', token);

        const res = await api.get('/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(' Failed to fetch orders:', err.response?.data || err.message);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded p-4 mb-4 bg-white shadow-sm">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>Status: {order.status}</p>
            <p className="text-sm text-gray-500">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {order.orderItems && order.orderItems.length > 0 && (
              <>
                <p className="mt-2 font-medium">Items:</p>
                <ul className="ml-4 list-disc text-sm">
                  {order.orderItems.map((item, index) => (
                    <li key={index}>
                      {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
