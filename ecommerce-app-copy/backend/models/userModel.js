import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }, //when user created cartis an empty object 
    role: { type: String, enum: ['customer', 'staff', 'owner', 'delivery'], default: 'customer' }

}, { minimize: false }) //when we create the cart data by default we have provided the value empty object

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;