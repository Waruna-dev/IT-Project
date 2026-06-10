import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

const sampleProducts = [
  {
    name: 'Classic Tee',
    description: 'Comfortable cotton t-shirt in multiple colors',
    category: 'Men',
    subCategory: 'Topwear',
    price: 1999,
    bestseller: false,
    sizes: ['S','M','L','XL'],
    image: [],
    date: Date.now()
  },
  {
    name: 'Denim Jacket',
    description: 'Stylish denim jacket with warm lining',
    category: 'Women',
    subCategory: 'Topwear',
    price: 5499,
    bestseller: true,
    sizes: ['S','M','L'],
    image: [],
    date: Date.now()
  }
];

export const seedIfEmpty = async () => {
  try {
    const count = await productModel.countDocuments();
    if (count === 0) {
      await productModel.insertMany(sampleProducts);
      console.log('Seeded sample products');
    } else {
      console.log('Products collection already has data (count=' + count + ')');
    }
    // seed a test user for development if none exists
    const testEmail = 'devuser@example.com';
    const existingUser = await userModel.findOne({ email: testEmail });
    if (!existingUser) {
      const password = 'Devpass123';
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const u = new userModel({ name: 'Dev User', email: testEmail, password: hashed, role: 'customer' });
      await u.save();
      console.log('Seeded dev user:', testEmail, 'password:', password);
    } else {
      console.log('Dev user already exists:', testEmail);
    }
  } catch (error) {
    console.error('Seeding failed:', error.message || error);
  }
};

export default seedIfEmpty;
