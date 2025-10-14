import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic details
    name: {
      type: String,
      required: true,
      trim: true, // removes spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // User-specific data
    cartData: {
      type: Object,
      default: {},
    },

    // Role-based access
    role: {
      type: String,
      enum: ["customer", "staff", "owner", "delivery", "admin"],
      default: "customer",
    },

    // Password reset management
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // Activity tracking (for reporting)
    lastLogin: {
      type: Date, // updated every time user logs in
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    minimize: false,  // ensures empty objects are saved as {}
  }
);


const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
