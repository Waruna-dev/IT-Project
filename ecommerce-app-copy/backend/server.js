import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectClodinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoute.js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import requestRouter from './routes/requestRoutes.js'; // Import the new router
//
import feedbackRoute from "./routes/feedbackRoute.js";// Import the new router

//app config
const app = express()
const port = process.env.PORT || 4000


//middleware
app.use(express.json())  //requests are passed using by json
app.use(cors()) //can access the backend from any  ip
connectDB();
connectClodinary();


// ...ai
app.post('/api/ask', async (req, res) => {
     try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          // It's better to use a more recent stable model like "gemini-1.5-flash"
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const prompt = `Give me a small description on: ${req.body.query}`
          const result = await model.generateContent(prompt);

          // ** FIX IS HERE **
          // Get the response object from the result
          const response = await result.response;
          // Call the text() method to get the string
          const text = response.text();

          // Send a simple object with just the text
          res.status(200).json({ text: text });

     } catch (error) {
          console.error('Gemini API error:', error);
          res.status(500).json({ error: 'Failed to fetch Gemini response' });
     }
})

//ai end




//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.use('/api', requestRouter); // Add the new router here

app.use("/api/feedback", feedbackRoute);// Use the new feedback router

//api endpoints
app.get('/', (req, res) => {
     res.send("API WORKING")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))

//PWD/UN = greatstack

//mongodb+srv://greatstack:greatstack@cluster0.al37goa.mongodb.net/       //ona na - ?retryWrites=true&w=majority&appName=Cluster0

//npm install mongodb


