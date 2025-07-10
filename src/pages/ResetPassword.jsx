import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Reset Password</button>
    </form>
  );
}
