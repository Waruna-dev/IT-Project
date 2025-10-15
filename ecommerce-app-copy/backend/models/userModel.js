import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    cartData: {
      type: Object,
      default: {},
    },
    role: {
      type: String,
      enum: ["customer", "staff", "owner", "delivery", "admin"],
      default: "customer",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

// ----- STATIC METHOD: Update each user's isActive based on lastLogin -----
userSchema.statics.updateIsActiveBasedOnLastLogin = async function () {
  const users = await this.find(); // get all users
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const user of users) {
    if (user.lastLogin && user.lastLogin > oneWeekAgo) {
      user.isActive = true;
    } else {
      user.isActive = false;
    }
    await user.save();
  }

  console.log("All users' isActive status updated based on lastLogin.");
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
