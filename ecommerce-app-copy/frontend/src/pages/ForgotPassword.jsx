import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show "Sending..."
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/forgot-password",
        { email }
      );
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false); // back to normal
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 p-6 bg-white shadow rounded">
      <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
          disabled={loading} // disable input while sending
        />
        <button
          type="submit"
          className="bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={loading} // disable while sending
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
