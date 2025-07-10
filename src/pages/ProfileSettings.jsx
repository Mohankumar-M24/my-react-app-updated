import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProfileSettings() {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [avatar, setAvatar] = useState(null);

  // Load current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('https://backend-new-1-x36j.onrender.com/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error(' Failed to fetch profile', err);
        toast.error('❌ Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      let res;
      if (avatar) {
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('avatar', avatar);

        res = await axios.put('https://backend-new-1-x36j.onrender.com/api/profile/me', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      } else {
        res = await axios.put(
          'https://backend-new-1-x36j.onrender.com/api/profile/me',
          { name: user.name, email: user.email },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }

      setUser(res.data);
      toast.success('✅ Profile updated successfully');
    } catch (err) {
      console.error(' Failed to update profile:', err.response?.data || err.message);
      toast.error('❌ Profile update failed');
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword } = passwords;

    if (!currentPassword || !newPassword) {
      return toast.warning('⚠️ Enter both current and new passwords');
    }

    if (newPassword.length < 6) {
      return toast.warning('⚠️ New password must be at least 6 characters');
    }

    const token = localStorage.getItem('token');

    try {
      await axios.put(
        'https://backend-new-1-x36j.onrender.com/api/profile/change-password',
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success('✅ Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error(' Password change error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">👤 Profile Settings</h2>

      <input
        name="name"
        value={user.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Name"
      />
      <input
        name="email"
        value={user.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Email"
      />

      {user.avatar && (
        <img
          src={`https://backend-new-1-x36j.onrender.com${user.avatar}`}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mb-3"
          onError={(e) => {
            e.target.src = '/default-avatar.png'; // fallback if image is broken
          }}
        />
      )}

      <input type="file" onChange={handleAvatarUpload} className="mb-3" />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Save Changes
      </button>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-2">🔒 Change Password</h3>
      <input
        type="password"
        value={passwords.currentPassword}
        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Current Password"
      />
      <input
        type="password"
        value={passwords.newPassword}
        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
        placeholder="New Password"
      />
      <button
        onClick={handlePasswordChange}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
    </div>
  );
}
