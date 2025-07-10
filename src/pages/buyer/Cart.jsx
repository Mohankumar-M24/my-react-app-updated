import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return <div className="text-center text-gray-600 text-lg">🛒 Your cart is empty</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 My Cart</h2>

      {cart.map((item) => (
        <div key={item._id} className="flex items-center justify-between border-b py-3">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">
              ₹{item.price} × {item.quantity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id, -1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item._id)}
              className="ml-4 text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right text-xl font-semibold">
        Total: ₹{totalPrice.toFixed(2)}
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={() => navigate('/checkout')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
