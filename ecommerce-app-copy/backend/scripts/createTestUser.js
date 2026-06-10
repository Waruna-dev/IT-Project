import connectDB from '../config/mongodb.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

const run = async () => {
  try {
    await connectDB();
    const email = 'testuser@example.com';
    const password = 'Test1234A';
    const name = 'Dev Test User';

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const existing = await userModel.findOne({ email });
    if (existing) {
      existing.password = hashed;
      existing.name = name;
      existing.role = 'customer';
      await existing.save();
      console.log('Updated existing test user:', email);
    } else {
      const u = new userModel({ name, email, password: hashed, role: 'customer' });
      await u.save();
      console.log('Created test user:', email);
    }

    console.log('You can now login with:', email, '/', password);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create test user:', err.message || err);
    process.exit(1);
  }
};

run();
