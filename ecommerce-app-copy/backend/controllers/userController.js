import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from "moment-timezone"; //local time conversion


// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Convert Date to Sri Lanka time string
const convertToSriLankaTime = (date) => {
    return date ? moment(date).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss") : null;
};

// ---------------------- User Login ----------------------
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User does not exist." });
        if (user.role !== 'customer') return res.json({ success: false, message: "Only customers can login here." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials." });

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            role: user.role,
            lastLogin: convertToSriLankaTime(user.lastLogin),
            createdAt: convertToSriLankaTime(user.createdAt)
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ---------------------- User Register ----------------------
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!validator.isEmail(email)) return res.json({ success: false, message: "Enter valid email." });
        if (password.length < 8) return res.json({ success: false, message: "Password should be more than 8 characters." });

        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists." });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        newUser.lastLogin = new Date(); // Set lastLogin on registration
        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            lastLogin: convertToSriLankaTime(user.lastLogin),
            createdAt: convertToSriLankaTime(user.createdAt)
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ---------------------- Admin Login ----------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email and role
    const user = await userModel.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.json({ success: false, message: 'Invalid credentials or not an admin.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }

    // Update last login and save
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    // Respond once
    res.json({
      success: true,
      token,
      role: user.role,
      lastLogin: convertToSriLankaTime(user.lastLogin)
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'An error occurred during login.' });
  }
};

export default adminLogin;

// ---------------------- Staff Login ----------------------
const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || user.role !== 'staff') {
            return res.json({ success: false, message: 'Invalid credentials or not a staff member.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: 'Invalid credentials.' });

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({
            success: true,
            token,
            lastLogin: convertToSriLankaTime(user.lastLogin),
            createdAt: convertToSriLankaTime(user.createdAt)
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'An error occurred during staff login.' });
    }
};

// ---------------------- Delivery Login ----------------------
const deliveryLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || user.role !== 'delivery') {
            return res.json({ success: false, message: 'Invalid credentials or not a delivery member.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: 'Invalid credentials.' });

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            token,
            lastLogin: convertToSriLankaTime(user.lastLogin),
            createdAt: convertToSriLankaTime(user.createdAt)
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'An error occurred during delivery login.' });
    }
};

// ---------------------- Add User ----------------------
const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.json({ success: false, message: 'Email already registered.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.json({ success: true, message: 'User added successfully.' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Something went wrong.' });
    }
};

// ---------------------- Get All Users with Search ----------------------
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query; // e.g. /api/user?search=john

    // Step 1: Build a search condition (case-insensitive)
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },   // match name
          { email: { $regex: search, $options: "i" } },  // match email
          { role: { $regex: search, $options: "i" } },   // match role
        ],
      };
    }

    // Step 2: Fetch filtered users
    const users = await userModel.find(query).select("-password");

    // Step 3: Convert times to Sri Lanka time
    const usersWithLocalTime = users.map((u) => ({
      ...u._doc,
      lastLogin: u.lastLogin
        ? convertToSriLankaTime(u.lastLogin)
        : null,
      createdAt: u.createdAt
        ? convertToSriLankaTime(u.createdAt)
        : null,
    }));

    res.json({ success: true, users: usersWithLocalTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch users." });
  }
};


// ---------------------- Update User ----------------------
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.json({ success: false, message: "User not found." });

        res.json({ success: true, message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to update user." });
    }
};

// ---------------------- Delete User ----------------------
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) return res.json({ success: false, message: "User not found." });

        res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to delete user." });
    }
};

export { loginUser, registerUser, adminLogin, staffLogin, deliveryLogin, addUser };
