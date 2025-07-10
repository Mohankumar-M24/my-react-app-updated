import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/seller/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setOrders(data.orders);
        setTotalOrders(data.orders.length);

        // Calculate total sales for this seller
        let sales = 0;
        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            if (item.seller === userId) {
              sales += item.price * item.quantity;
            }
          });
        });
        setTotalSales(sales);
      } catch (err) {
        console.error("Failed to load seller orders", err);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleStatusChange = async (orderId, itemIndex, newStatus) => {
    try {
      await axios.put(
        `/api/seller/orders/${orderId}/item/${itemIndex}/status`,
        { newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Refresh UI
      const updatedOrders = [...orders];
      updatedOrders.forEach((order) => {
        if (order._id === orderId) {
          order.items[itemIndex].shippingStatus = newStatus;
        }
      });
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update shipping status.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👋 Welcome, Seller!</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">📦 Total Orders</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">💰 Total Sales</p>
          <p className="text-xl font-bold">₹{totalSales}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">🔔 New Pending Items</p>
          <p className="text-xl font-bold">
            {
              orders.reduce((count, order) => {
                return (
                  count +
                  order.items.filter(
                    (item) =>
                      item.seller === userId && item.shippingStatus === "Pending"
                  ).length
                );
              }, 0)
            }
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">Recent Orders</h3>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 mb-4 rounded shadow-sm bg-white"
          >
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Placed At: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Status: <span className="font-medium">{order.status}</span></p>
            <div className="mt-2">
              <p className="font-medium">Items:</p>
              <ul className="ml-4 list-disc">
                {order.items.map((item, index) => {
                  if (item.seller !== userId) return null;

                  return (
                    <li key={index} className="mb-2">
                      <div>
                        {item.name} — {item.quantity} × ₹{item.price}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="text-sm">Shipping Status:</label>
                        <select
                          value={item.shippingStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, index, e.target.value)
                          }
                          className="border px-2 py-1 rounded"
                        >
                          <option>Pending</option>
                          <option>Shipped</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
