const ProductReviews = ({ reviews }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="border-b py-2">
            <p className="font-semibold">{r.name}</p>
            <p>⭐ {r.rating} / 5</p>
            <p>{r.comment}</p>
            <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;
