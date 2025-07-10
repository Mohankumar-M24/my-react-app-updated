import { useState } from 'react';
import axios from 'axios';

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('seller', userId); // Assuming seller is logged in
    formData.append('image', image);

    try {
      await axios.post('https://backend-new-1-x36j.onrender.com/api/products', formData,  {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Product added successfully!');
    } catch (err) {
  console.error(err.response?.data || err.message);
  alert('❌ Failed to add product: ' + (err.response?.data?.error || err.message));
}

  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded" required />
        <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <input type="number" name="price" onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
        <input type="text" name="category" onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" required />
        <input type="file" onChange={handleImage} className="w-full p-2" required />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Add Product</button>
      </form>
    </div>
  );
}
