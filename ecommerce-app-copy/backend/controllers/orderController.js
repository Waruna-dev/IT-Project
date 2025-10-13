import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

//global variables
const currency = 'LKR'
const deliveryCharge = 250

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // ADDED VALIDATION 1: Check for required fields and empty cart
        if (!userId || !items || !amount || !address) {
            return res.json({ success: false, message: "Missing required order data." });
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Cannot place an empty order." });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order placed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//placing order using stripe method
const placeOrderStripe = async (req, res) => {

    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        // ADDED VALIDATION 1: Check for required fields and empty cart
        if (!userId || !items || !amount || !address || !origin) {
            return res.json({ success: false, message: "Missing required order data." });
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Cannot place an empty order." });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'

        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//verify stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body

    // ADDED VALIDATION 1: Check for required fields
    if (!orderId || typeof success === 'undefined' || !userId) {
        return res.json({ success: false, message: "Missing required verification data." });
    }

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//placing order using razor method
const placeOrderRazorpay = async (req, res) => {
    // 
}


//All orders for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//User order data for frontend (my orders)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // ADDED VALIDATION 1: Check if ID is provided
        if (!id) {
            return res.json({ success: false, message: "Order ID is missing." });
        }
        await orderModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export { verifyStripe, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus }