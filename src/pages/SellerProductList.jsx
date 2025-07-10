import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // ✅ Centralized API instance

export default function SellerProductList() {
  const [products, setProducts] = useState([]);
  const sellerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sellerProducts = res.data.filter(product => product.seller === sellerId);
        setProducts(sellerProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [sellerId, token]);

  const handleEdit = (product) => {
    localStorage.setItem('productToEdit', JSON.stringify(product));
    navigate('/dashboard/edit-product');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter(p => p._id !== id));
      alert('✅ Product deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('❌ Failed to delete product');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">You haven't added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-green-600 mt-2 font-semibold">₹{product.price}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
