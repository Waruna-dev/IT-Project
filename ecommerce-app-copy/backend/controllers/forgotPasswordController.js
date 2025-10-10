import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";
import crypto from "crypto";

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Ethereal transporter (testing only)
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "gkecjpehjo74hmlc@ethereal.email",
        pass: "hmCPnS65J1J5aMzHnD",
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const message = `You requested a password reset. Click here: ${resetUrl}`;

    const info = await transporter.sendMail({
      from: '"Test App" <test@example.com>',
      to: user.email,
      subject: "Reset Your Password",
      text: message,
    });

    console.log("Reset link (preview):", nodemailer.getTestMessageUrl(info));
    console.log("Saved token:", token);

    res.json({ success: true, message: "Reset link sent! Check terminal for URL." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.json({ success: false, message: "Failed to send reset email." });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Debug logs
    console.log("Received token:", token);

    // 1. Find user with valid token and not expired
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("User found:", user);

    if (!user) return res.json({ success: false, message: "Invalid or expired token." });

    // 2. Hash new password
    const bcrypt = await import("bcrypt");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 3. Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.json({ success: false, message: "Failed to reset password." });
  }
};
