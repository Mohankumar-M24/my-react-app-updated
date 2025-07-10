import { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Reset Link
      </button>
    </form>
  );
}
