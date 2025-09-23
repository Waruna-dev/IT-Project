import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password'); // hide password
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};
