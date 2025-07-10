import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const fetchProduct = async () => {
    const res = await axios.get(`/api/products/${id}`);
    setProduct(res.data);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      setMessage('Review added!');
      setRating(5);
      setComment('');
      fetchProduct();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding review');
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <p className="text-lg font-semibold">₹{product.price}</p>
      <p className="mt-2">{product.description}</p>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold">Customer Reviews</h2>
      {product.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        product.reviews.map((r) => (
          <div key={r._id} className="border-b py-2">
            <p className="font-semibold">{r.name}</p>
            <p>⭐ {r.rating}/5</p>
            <p>{r.comment}</p>
            <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}

      {userInfo && (
        <form onSubmit={handleReviewSubmit} className="mt-6">
          <h3 className="text-lg font-bold mb-2">Write a Review</h3>
          {message && <p className="text-red-500 text-sm mb-2">{message}</p>}

          <label className="block mb-1">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border p-2 mb-2"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} - {['Excellent', 'Good', 'Average', 'Poor', 'Terrible'][5 - r]}
              </option>
            ))}
          </select>

          <label className="block mb-1">Comment</label>
          <textarea
            className="w-full border p-2 mb-2"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductPage;
