import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";
import crypto from "crypto";

// =========================
// FORGOT PASSWORD CONTROLLER
// =========================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    // Generate reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // ⏱️ 5 minutes
    await user.save();

    // Create Gmail transporter (using App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // Create reset link
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const message = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 5 minutes.</p>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Harsha Fashion" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.json({
      success: true,
      message: "Reset link sent to your email address!",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.json({ success: false, message: "Failed to send reset email." });
  }
};

// =========================
// RESET PASSWORD CONTROLLER
// =========================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user with valid token
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.json({ success: false, message: "Invalid or expired link." });

    // Hash new password
    const bcrypt = await import("bcrypt");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.json({ success: false, message: "Failed to reset password." });
  }
};
