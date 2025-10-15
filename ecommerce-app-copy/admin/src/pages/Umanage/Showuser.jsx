import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import debounce from "lodash.debounce";

const Showuser = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Fetch all or filtered users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/list`, {
        headers: { token },
        params: {
          search: searchTerm,
          role: filterRole,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  // Fetch users when search/filter changes (with debounce)
  useEffect(() => {
    const delayedFetch = debounce(() => {
      fetchUsers();
    }, 400); // 400ms delay for smooth searching

    delayedFetch();
    return delayedFetch.cancel;
  }, [searchTerm, filterRole]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🗑 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(`${backendUrl}/api/user/delete/${id}`, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  //  Update user
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/update/${editingUser._id}`,
        editingUser,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  //  Generate PDF report
  const handleGenerateReport = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/report`, {
        responseType: "blob",
        headers: { token },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Users_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>

      {/*  Search + Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={handleGenerateReport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📄 Generate Report
        </button>
      </div>

      {/*  User Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id} className="border">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/*  Edit Form */}
      {editingUser && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg mb-3">Update User</h3>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <select
            value={editingUser.role}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          >
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="delivery">Delivery</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showuser;
