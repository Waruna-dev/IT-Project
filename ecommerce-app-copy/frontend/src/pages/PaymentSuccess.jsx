import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Get transactionId and order details
  const transactionId = state?.transactionId;

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
      <p className="mt-2 text-gray-700">Your transaction ID: {transactionId}</p>
      <button
        onClick={() => navigate(`/Receipt/${transactionId}`)}
        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded"
      >
        View Receipt
      </button>
    </div>
  );
};

export default PaymentSuccess;
