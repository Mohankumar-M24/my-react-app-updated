import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Home() {
  const { isLoggedIn, role } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await axios.get(`https://backend-new-2-6l36.onrender.com/api/products?${params}`);
      setProducts(res.data);
    } catch (err) {
      console.error(' Failed to fetch products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const WishlistButton = ({ product }) => {
    return (
      <button onClick={() => toggleWishlist(product)} className="text-xl">
        {isInWishlist(product._id) ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-400 hover:text-red-500" />
        )}
      </button>
    );
  };

  return (
    <div className="p-4">
      {/* Search & Filter UI */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search..."
          className="p-2 border rounded"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="p-2 border rounded w-32"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="p-2 border rounded w-32"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow">
            <img
              src={`https://backend-new-2-6l36.onrender.com${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover mb-2"
              onError={(e) => (e.target.style.display = 'none')}
            />

            {/* Product name is now a link to the detail page */}
            <Link to={`/product/${product._id}`}>
              <h2 className="text-lg font-semibold hover:underline">{product.name}</h2>
            </Link>

            <p className="text-gray-600 capitalize">{product.category}</p>
            <p className="text-green-600 font-bold">₹{product.price}</p>

            {/* Show Add to Cart and Wishlist for logged in buyers only */}
            {isLoggedIn && role === 'buyer' && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => addToCart(product)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  Add to Cart
                </button>
                <WishlistButton product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
