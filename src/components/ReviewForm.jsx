import { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId, token, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://backend-new-2-6l36.onrender.com/api/products/${productId}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setMessage('Review added!');
      setComment('');
      onReviewAdded(); // refresh product info
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding review');
    }
  };

  return (
    <form onSubmit={submitHandler} className="mt-4">
      <h3 className="text-lg font-semibold">Write a Review</h3>
      {message && <p className="text-sm text-red-500">{message}</p>}

      <div className="mt-2">
        <label className="block mb-1">Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-1">
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} - {['Excellent', 'Good', 'Average', 'Poor', 'Terrible'][5 - r]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label className="block mb-1">Comment</label>
        <textarea
          className="border p-2 w-full"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
