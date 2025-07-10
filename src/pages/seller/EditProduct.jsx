import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // ✅ Import centralized axios instance

export default function EditProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const productData = JSON.parse(localStorage.getItem('productToEdit'));
    if (!productData) {
      alert('No product selected for editing.');
      navigate('/seller/products');
      return;
    }

    setForm({
      _id: productData._id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (image) {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('category', form.category);
        formData.append('image', image);

        await api.put(`/api/products/${form._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.put(`/api/products/${form._id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert('Product updated successfully!');
      navigate('/seller/products');
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          onChange={handleImage}
          className="w-full p-2"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
}
