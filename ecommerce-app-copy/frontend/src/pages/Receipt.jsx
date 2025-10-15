import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext.jsx";

const Receipt = () => {
  const { transactionId } = useParams();
  const { backendUrl, token } = useContext(ShopContext);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/payment/receipt/${transactionId}`, {
          headers: { token }
        });
        if (res.data.success) setReceipt(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReceipt();
  }, [transactionId]);

  if (!receipt) return <p className="text-center mt-10">Loading receipt...</p>;

  return (
    <div className="max-w-lg mx-auto border p-6 mt-10 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Payment Receipt</h2>

      <div className="space-y-2">
        <p><strong>Transaction ID:</strong> {receipt.transactionId}</p>
        <p><strong>Amount Paid:</strong> Rs. {receipt.amount}.00</p>
        <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
        <p><strong>Status:</strong> {receipt.paymentStatus}</p>
        <p><strong>Date:</strong> {new Date(receipt.createdAt).toLocaleString()}</p>

        <hr className="my-3" />
        <p><strong>Customer Name:</strong> {receipt.userId.name}</p>
        <p><strong>Email:</strong> {receipt.userId.email}</p>
      </div>

      <div className="text-center mt-5">
        <button onClick={() => window.print()} className="bg-black text-white px-5 py-2 rounded">
          Print / Download PDF
        </button>
      </div>
    </div>
  );
};

export default Receipt;
