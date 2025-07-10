import { useState, useEffect, useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext'; 

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext); // need to get addToCart from context
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const isWished = wishlist.some(item => item._id === product._id);

  const toggleWishlist = () => {
    let updated;
    if (isWished) {
      updated = wishlist.filter(item => item._id !== product._id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-700 mb-2">₹{product.price}</p>

      <div className="flex items-center gap-4">
        <button
          className="px-4 py-1 bg-blue-600 text-white rounded"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>

        <button onClick={toggleWishlist} className="text-xl">
          {isWished ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
