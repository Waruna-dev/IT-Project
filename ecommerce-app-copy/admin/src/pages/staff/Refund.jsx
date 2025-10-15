// admin/pages/staff/Refund.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App.jsx"; // Import backend URL

const Refund = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Stats
  const [refundCount, setRefundCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  //  Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/dashboard/stats`, {
          headers: { token },
        });
        if (res.data.success) {
          setRefundCount(res.data.data.refundCount);
          setPaymentCount(res.data.data.paymentCount);
          setTotalAmount(res.data.data.totalAmount);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    if (token) fetchStats();
  }, [token]);

  //  Fetch refund requests
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

  //  Remove a refund request
  const handleRemoveRequest = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/refund/remove`,
        { id },
        { headers: { token } }
      );

      if (res.data.success) {
        // Remove from UI
        setRequests((prev) => prev.filter((req) => req._id !== id));
        console.log("Refund request removed successfully.");

        // Refresh dashboard stats
        const statsRes = await axios.get(`${backendUrl}/api/dashboard/stats`, {
          headers: { token },
        });
        if (statsRes.data.success) {
          setRefundCount(statsRes.data.data.refundCount);
          setPaymentCount(statsRes.data.data.paymentCount);
          setTotalAmount(statsRes.data.data.totalAmount);
        }
      } else {
        console.error("Failed to remove refund request:", res.data.message);
      }
    } catch (error) {
      console.error("Error removing refund request:", error);
    }
  };

  if (loading) return <p>Loading refund requests...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Refund Requests</h1>

      {/*  STATS OVERVIEW */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md shadow-sm w-40 text-center">
          <p className="text-sm">Total Payments</p>
          <p className="text-lg font-bold">{paymentCount}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-md shadow-sm w-40 text-center">
          <p className="text-sm">Total Refunds</p>
          <p className="text-lg font-bold">{refundCount}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md shadow-sm w-48 text-center">
          <p className="text-sm">Total Payment Amount</p>
          <p className="text-lg font-bold">LKR{totalAmount}</p>
        </div>
      </div>

      {/*  REFUND TABLE */}
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
              <div
                key={req._id}
                className="border border-gray-400 mb-4 p-4 md:p-0 md:mb-0 md:table-row text-gray-600"
              >
                {/* Image */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Image:</span>
                  {req.orderItem?.image ? (
                    <img
                      src={req.orderItem.image[0]}
                      alt={req.orderItem?.name || "Product"}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    "N/A"
                  )}
                </div>

                {/* User */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">User:</span>
                  {req.email}
                </div>

                {/* Product */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Product:</span>
                  {req.orderItem?.name || "N/A"}
                </div>

                {/* Reason */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Reason:</span>
                  {req.reason}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Quantity:</span>
                  {req.quantity}
                </div>

                {/* Refund Method */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Refund Method:</span>
                  {req.refundMethod}
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Address:</span>
                  {req.address}
                </div>

                {/* Contact */}
                <div className="flex items-center gap-2 mb-2 md:table-cell md:p-3 md:border md:border-gray-400">
                  <span className="font-semibold md:hidden">Contact:</span>
                  {req.phone}
                </div>

                {/* Remove Button */}
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

export default Refund;
