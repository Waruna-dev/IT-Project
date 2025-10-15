import mongoose from "mongoose";
import userModel from "./models/userModel.js"; // adjust path

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const runUpdate = async () => {
  await userModel.updateIsActiveBasedOnLastLogin();
  mongoose.connection.close(); // close connection after updating
};

runUpdate();
