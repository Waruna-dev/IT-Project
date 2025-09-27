// admin/pages/Myprofile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Myprofile = ({ token }) => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({ name: "", password: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setProfile(res.data.user);
          setForm({ name: res.data.user.name, password: "" });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${backendUrl}/api/user/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        alert("Profile updated!");
        setProfile(res.data.user);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Email (read only):</label>
          <input
            value={profile.email || ""}
            disabled
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Name:</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium">New Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Myprofile;
