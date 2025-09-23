// admin/pages/staff/Exchange.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

// Import the backendUrl directly from App.jsx's constants
import { backendUrl } from '../../App.jsx';

const Exchange = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Use the backendUrl and token from the component's scope
        const res = await axios.get(`${backendUrl}/api/exchange/list`, {
          headers: { token },
        });
        if (res.data.success) {
          setRequests(res.data.data);
        }
      } catch (error) {    
        // ADDED VALIDATION 1: Handle API failure to fetch requests
        console.error("Error fetching exchange requests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if a token exists
    if (token) {
      fetchRequests();
    } else {
      // ADDED VALIDATION 3: Display a message if no token is found
      setLoading(false);
      alert("Authentication token not found. Please log in again.");
    }
  }, [token]);

  // ADDED: Function to handle the removal of a request
  const handleRemoveRequest = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/exchange/remove`, { id }, { headers: { token } });
      if (res.data.success) {
        // Update the state to remove the item without a full page reload
        setRequests(requests.filter(req => req._id !== id));
        console.log("Request removed successfully.");
      } else {
        console.error("Failed to remove request:", res.data.message);
      }
    } catch (error) {
      console.error("Error removing exchange request:", error);
    }
  };

  if (loading) return <p>Loading exchange requests...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Exchange Requests</h1>
      {requests.length === 0 ? (
        <p>No exchange requests found.</p>
      ) : (
        <div className="w-full overflow-x-auto md:table">
          <div className="hidden md:table-header-group">
            <div className="table-row bg-gray-100 text-gray-600 font-semibold text-left">
              <div className="table-cell p-3 border border-gray-400">Image</div>
              <div className="table-cell p-3 border border-gray-400">User</div>
              <div className="table-cell p-3 border border-gray-400">Product</div>
              <div className="table-cell p-3 border border-gray-400">Reason</div>
              <div className="table-cell p-3 border border-gray-400">Quantity</div>
              <div className="table-cell p-3 border border-gray-400">Exchange Method</div>
              <div className="table-cell p-3 border border-gray-400">Address</div>
              <div className="table-cell p-3 border border-gray-400">Contact</div>
              {/* ADDED: New header for the remove button */}
              <div className="table-cell p-3 border border-gray-400">Action</div>
            </div>
          </div>
          <div className="md:table-row-group">
            {requests.map((req) => (
              <div key={req._id} className="border border-gray-400 mb-4 p-4 md:p-0 md:mb-0 md:table-row text-gray-600">
                {/* Image Cell */}
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
                {/* User Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">User:</span>
                  {req.email}
                </div>
                {/* Product Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Product:</span>
                  {req.orderItem?.name || "N/A"}
                </div>
                {/* Reason Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Reason:</span>
                  {req.reason}
                </div>
                {/* Quantity Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Quantity:</span>
                  {req.quantity}
                </div>
                {/* Exchange Method Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Exchange Method:</span>
                  {req.exchangeMethod}
                </div>
                {/* Address Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Address:</span>
                  <div>
                    {req.address}
                    {req.pickupDateTime && (
                      <>
                        <br />
                        <span className="font-bold">Pickup Time:</span> {new Date(req.pickupDateTime).toLocaleString()}
                      </>
                    )}
                  </div>
                </div>
                {/* Contact Cell */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Contact:</span>
                  {req.phone}
                </div>
                {/* ADDED: New cell for the remove button */}
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

export default Exchange;
