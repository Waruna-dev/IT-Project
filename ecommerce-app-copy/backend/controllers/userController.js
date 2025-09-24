import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}


//route for user login  CHANGED back
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exists." })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            // Combine all necessary data into a single response
            res.json({ success: true, token, role: user.role });
        } else {
            res.json({ success: false, message: 'Invalid credentials.' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        //checking whether user already exist or not
        const exists = await userModel.findOne({ email })

        if (exists) {
            return res.json({ success: false, message: "User already exists." })
        }

        //validating email format and strong password
        if (!validator.isEmail(email)) {                  //if email is not valid
            return res.json({ success: false, message: "Enter valid email." })
        }

        if (password.length < 8) {                  //if pass. is not valid
            return res.json({ success: false, message: "Password should be more than 8 characters." })
        }

        //password hashing
        const salt = await bcrypt.genSalt(12) //when number increasing it  takes more time to encrypt the pwd
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        //save the user in DB
        const user = await newUser.save()

        //create token when register using id

        const token = createToken(user._id)

        res.json({ success: true, token })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}





//route for admin login

// This is what you should have (based on the previous discussion)

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await userModel.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.json({ success: false, message: 'Invalid credentials or not an admin.' });
    }

    // 2. IMPORTANT: Use bcrypt.compare() to check the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Passwords match, create a token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
      res.json({ success: true, token });
    } else {
      // Passwords do not match
      res.json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'An error occurred during login.' });
  }
};



export default adminLogin;




// Add this function alongside your other login controllers
const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await userModel.findOne({ email });

        // 2. Check if the user exists and has the 'staff' role
        if (!user || user.role !== 'staff') {
            return res.json({ success: false, message: 'Invalid credentials or not a staff member.' });
        }

        // 3. Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // 4. If passwords match, create a JWT token with the user's ID and role
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'An error occurred during staff login.' });
    }
};



const deliveryLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        // Check if user exists and is delivery role
        if (!user || user.role !== 'delivery') {
            return res.json({ success: false, message: 'Invalid credentials or not a delivery member.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'An error occurred during delivery login.' });
    }
};


//new added
 const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered.' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.json({ success: true, message: 'User added successfully.' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Something went wrong.' });
  }
};


//////////////////////////
// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); // hide password
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch users." });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to update user." });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to delete user." });
  }
};


export { loginUser, registerUser, adminLogin, staffLogin, deliveryLogin, addUser }