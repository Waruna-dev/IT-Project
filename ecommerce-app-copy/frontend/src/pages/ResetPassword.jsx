import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // for redirecting
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Check password strength (live)
  const checkPasswordStrength = (value) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const mediumRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (strongRegex.test(value)) setPasswordStrength("Strong");
    else if (mediumRegex.test(value)) setPasswordStrength("Medium");
    else setPasswordStrength("Weak");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password strength & match validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:4000/api/user/reset-password", {
        token,
        password,
      });

      if (data.success) {
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500); // Redirect after 2.5 seconds
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl mb-4 text-center font-semibold">Reset Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Password Input */}
        <div>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            className="border p-2 rounded w-full"
            required
          />
          {password && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength === "Strong"
                  ? "text-green-600"
                  : passwordStrength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Strength: {passwordStrength}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition-all"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
