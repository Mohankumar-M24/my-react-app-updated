// src/pages/buyer/Wishlist.jsx
import { useState, useEffect } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="border rounded p-4 shadow">
              <img
                src={`https://backend-new-2-6l36.onrender.com${item.image}`}
                alt={item.name}
                className="w-full h-40 object-cover mb-3"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-500 capitalize">{item.category}</p>
              <p className="text-green-600 font-bold mb-2">₹{item.price}</p>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
