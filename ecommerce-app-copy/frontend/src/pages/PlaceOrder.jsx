import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import jsPDF from "jspdf";

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  // ✅ Generate and download receipt PDF
  const generateReceipt = (orderData) => {
  const doc = new jsPDF();

  const date = new Date().toLocaleString();

  doc.setFontSize(18);
  doc.text("Payment Receipt", 80, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 14, 30);

  doc.text("Customer Details:", 14, 45);
  doc.text(`Name: ${formData.firstName} ${formData.lastName}`, 14, 52);
  doc.text(`Email: ${formData.email}`, 14, 59);
  doc.text(`Phone: ${formData.phone}`, 14, 66);
  doc.text(`Address: ${formData.street}, ${formData.city}, ${formData.state}`, 14, 73);
  doc.text(`Country: ${formData.country} - ${formData.zipcode}`, 14, 80);

  doc.text("------------------------------------------------------", 14, 88);

  doc.text("Order Summary:", 14, 98);
  let y = 105;
  orderData.items.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.name} (${item.size})  x${item.quantity}`, 14, y);
    y += 7;
  });

  doc.text("------------------------------------------------------", 14, y + 5);
  doc.text(`Subtotal: $${getCartAmount().toFixed(2)}`, 14, y + 15);
  doc.text(`Delivery Fee: $${delivery_fee.toFixed(2)}`, 14, y + 22);
  doc.text(`Total Amount: $${orderData.amount.toFixed(2)}`, 14, y + 29);
  doc.text(`Payment Method: ${method.toUpperCase()}`, 14, y + 36);

  doc.text("------------------------------------------------------", 14, y + 43);
  doc.text("Thank you for shopping with us!", 75, y + 53);

  // ✅ Download the file
  doc.save("Payment_Receipt.pdf");
};

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // ✅ VALIDATION 1: Ensure cart not empty
    if (Object.keys(cartItems).length === 0 || getCartAmount() === 0) {
      toast.error("Your cart is empty. Please add items to place an order.");
      return;
    }

    // ✅ VALIDATION 2: Phone number format
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number (10-15 digits).");
      return;
    }

    // ✅ VALIDATION 3: Check all required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the '${field}' field.`);
        return;
      }
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      // ✅ Handle order placement and receipt generation
      switch (method) {
        // CASE 1: CASH ON DELIVERY
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          if (response.data.success) {
            generateReceipt(orderData);  // Download receipt
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        // CASE 2: STRIPE PAYMENT
        case 'stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
          if (responseStripe.data.success) {
            generateReceipt(orderData);  // Download receipt before redirect
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-300 mt-7'>
      {/* LEFT SIDE - DELIVERY INFO */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="text" placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300 ' type="email" placeholder='Email' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-300' type="phone" placeholder='Phone' />
      </div>

      {/* RIGHT SIDE - PAYMENT */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'COMPONENT'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer overflow-hidden'>
              <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer overflow-hidden'>
              <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay" />
            </div>

            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer overflow-hidden'>
              <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm cursor-pointer'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
