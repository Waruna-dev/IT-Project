import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { ShopContext } from '../context/ShopContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, setToken, setCartItems } = useContext(ShopContext);
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------- Fetch profile on load --------------------
useEffect(() => {
  if (!token) {
    navigate('/login'); // redirect to login if no token
    return;
  }

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProfile({ ...data.user, password: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token, navigate]);


  // -------------------- Handle input changes --------------------
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // -------------------- Update profile --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) toast.success('Profile updated successfully!');
      else toast.error(data.message);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  // -------------------- Delete account --------------------
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);

        // Logout after deletion
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken('');
        setCartItems({});
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete account.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium">Email (Read only)</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Save Changes */}
        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Save Changes
        </button>

        {/* Delete Account */}
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mt-2"
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default Profile;
