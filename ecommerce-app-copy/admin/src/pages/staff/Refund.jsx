// admin/pages/staff/Refund.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

// Import the backendUrl directly from App.jsx's constants
import { backendUrl } from '../../App.jsx';

const Refund = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/refund/list`, {
          headers: { token },
        });
        if (res.data.success) {
          setRequests(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching refund requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleRemoveRequest = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/refund/remove`, { id }, { headers: { token } });
      if (res.data.success) {
        setRequests(requests.filter(req => req._id !== id));
        console.log("Refund request removed successfully.");
      } else {
        console.error("Failed to remove refund request:", res.data.message);
      }
    } catch (error) {
      console.error("Error removing refund request:", error);
    }
  };

  if (loading) return <p>Loading refund requests...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Refund Requests</h1>

      {/*  Total Refund Count Box */}
<div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg mb-6 w-fit">
  <h2 className="text-lg font-semibold">Total Refund Requests</h2>
  <p className="text-3xl font-bold mt-2">{requests.length}</p>
</div>

      {requests.length === 0 ? (
        <p>No refund requests found.</p>
      ) : (
        <div className="w-full overflow-x-auto md:table">
          <div className="hidden md:table-header-group">
            <div className="table-row bg-gray-100 text-gray-600 font-semibold text-left">
              <div className="table-cell p-3 border border-gray-400">Image</div>
              <div className="table-cell p-3 border border-gray-400">User</div>
              <div className="table-cell p-3 border border-gray-400">Product</div>
              <div className="table-cell p-3 border border-gray-400">Reason</div>
              <div className="table-cell p-3 border border-gray-400">Quantity</div>
              <div className="table-cell p-3 border border-gray-400">Refund Method</div>
              <div className="table-cell p-3 border border-gray-400">Address</div>
              <div className="table-cell p-3 border border-gray-400">Contact</div>
              <div className="table-cell p-3 border border-gray-400">Action</div>
            </div>
          </div>
          <div className="md:table-row-group">
            {requests.map((req) => (
              <div key={req._id} className="border border-gray-400 mb-4 p-4 md:p-0 md:mb-0 md:table-row text-gray-600">
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Image:</span>
                  {req.orderItem?.image ? (
                    <img 
                      src={req.orderItem.image[0]} 
                      alt={req.orderItem?.name || 'Product Image'} 
                      className="w-16 h-16 object-cover" 
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">User:</span>
                  {req.email}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Product:</span>
                  {req.orderItem?.name || "N/A"}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Reason:</span>
                  {req.reason}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Quantity:</span>
                  {req.quantity}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Refund Method:</span>
                  {req.refundMethod}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Address:</span>
                  {req.address}
                </div>
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Contact:</span>
                  {req.phone}
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0 md:table-cell md:p-3 md:border md:border-gray-400">
                  <button
                    onClick={() => handleRemoveRequest(req._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Refund;