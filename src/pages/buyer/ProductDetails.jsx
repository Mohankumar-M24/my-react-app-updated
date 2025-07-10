import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { isLoggedIn, role } = useContext(AuthContext);

  console.log("AuthContext values:", { isLoggedIn, role });

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(false);

  // to fetch product details
  useEffect(() => {
    axios
      .get(`https://backend-new-1-x36j.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Failed to load product', err));
  }, [id, refresh]);

  // Handle review submit
  const submitReview = async () => {
    try {
      const res = await axios.post(
        `https://backend-new-1-x36j.onrender.com/api/products/${id}/reviews`,
        { rating, comment },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setComment('');
      setRating(5);
      setRefresh(!refresh); // refresh review list
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <img
          src={`https://backend-new-1-x36j.onrender.com/${product.image}`}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 capitalize mb-1">{product.category}</p>
          <p className="text-green-600 font-bold text-xl mb-4">₹{product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="text-yellow-500 mb-2">
            ⭐ {product.rating?.toFixed(1) || 'No rating yet'} ({product.numReviews || 0} reviews)
          </div>
        </div>
      </div>

      {/* Buyer Review Form */}
      {isLoggedIn && role === 'buyer' && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
          {message && <p className="text-blue-600 text-sm mb-2">{message}</p>}

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="p-2 border rounded mb-2 block"
          >
            <option value={5}>⭐ 5 - Excellent</option>
            <option value={4}>⭐ 4 - Good</option>
            <option value={3}>⭐ 3 - Average</option>
            <option value={2}>⭐ 2 - Poor</option>
            <option value={1}>⭐ 1 - Terrible</option>
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="p-2 border rounded w-full h-24 mb-2"
          />

          <button
            onClick={submitReview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}


      {/* Review List */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((rev, idx) => (
            <div key={idx} className="border-b py-3">
              <div className="font-semibold">{rev.name} — ⭐ {rev.rating}</div>
              <div className="text-gray-700">{rev.comment}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
