import express from 'express'
import {placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe, deleteOrder } from '../controllers/orderController.js'
//import adminAuth from '../middleware/adminAuth.js'
import roleAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js'
import staffAuth from '../middleware/staffAuth.js'
import deliveryAuth from '../middleware/deliveryAuth.js'

const orderRouter = express.Router()

//admin features
//orderRouter.post('/list', allOrders)
orderRouter.post('/list', roleAuth('admin', 'staff', 'delivery'), allOrders);
orderRouter.post('/status', updateStatus)

// New delete route
orderRouter.delete("/delete/:id", deleteOrder);

//payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

//User feature
orderRouter.post('/userorders', authUser, userOrders)

//verify order
orderRouter.post('/verifyStripe', authUser, verifyStripe)
export default orderRouter