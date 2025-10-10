import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { ShopContext } from '../context/ShopContext.jsx';
import { toast } from 'react-toastify';

const Profile = () => {
  const { token } = useContext(ShopContext);
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);

  // Fetch profile on load
  useEffect(() => {
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
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <div>
          <label className="block text-sm font-medium">Email (Read only)</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly // <-- make it read-only
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

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

        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
