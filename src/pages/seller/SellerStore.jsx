import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const SellerStore = () => {
  const { token } = useAuth();

  const [store, setStore] = useState({
    name: '',
    description: '',
    logo: '',
    contactEmail: '',
    phone: '',
    location: {
      city: '',
      pincode: '',
    },
  });

  const [isExisting, setIsExisting] = useState(false);

  // Load store info
  useEffect(() => {
    const fetchStore = async () => {
      if (!token) return;
      try {
        const res = await axios.get('https://backend-new-2-6l36.onrender.com/api/store/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStore(res.data);
        setIsExisting(true);
      } catch (err) {
        if (err.response?.status === 404) {
          setIsExisting(false); // new store
        } else {
          toast.error('❌ Failed to load store');
        }
      }
    };

    fetchStore();
  }, [token]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'pincode') {
      setStore((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setStore((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isExisting ? '/api/store' : '/api/store';
      const method = isExisting ? 'put' : 'post';

      const res = await axios[method](url, store, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`✅ Store ${isExisting ? 'updated' : 'created'} successfully`);
      setIsExisting(true);
      setStore(res.data);
    } catch (err) {
      console.error(err);
      toast.error('❌ Store save failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🏬 Manage Your Store</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={store.name}
          onChange={handleChange}
          placeholder="Store Name"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={store.description}
          onChange={handleChange}
          placeholder="Store Description"
          className="w-full border p-2 rounded"
        ></textarea>
        <input
          name="logo"
          value={store.logo}
          onChange={handleChange}
          placeholder="Logo URL (optional)"
          className="w-full border p-2 rounded"
        />
        <input
          name="contactEmail"
          value={store.contactEmail}
          onChange={handleChange}
          placeholder="Contact Email"
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          value={store.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
        />
        <input
          name="city"
          value={store.location.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-2 rounded"
        />
        <input
          name="pincode"
          value={store.location.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isExisting ? 'Update Store' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default SellerStore;
