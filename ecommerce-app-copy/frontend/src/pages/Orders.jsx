// Orders.jsx
import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title.jsx';
import { ShopContext } from '../context/ShopContext.jsx'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [form, setForm] = useState({ q1: "", q2: "", q3: "", q4: "" });
  const navigate = useNavigate();

  const loadOrderData = async () => {
    try {
      if (!token) return;
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitFeedback = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/feedback/submit",
        { ...form },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Thanks for your feedback!");
        setShowFeedback(false);
        setForm({ q1: "", q2: "", q3: "", q4: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting feedback");
    }
  };

  return (
    <div className='mt-7 border-t border-gray-300 pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div key={index} className='py-4 border-b border-gray-300 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-12'>
            <div className='flex items-start gap-6 text-sm'>
              <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p>{currency}{` ${item.price.toFixed(2)}`}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                <p className='mt-1 font-semibold'>Delivery charges will be added <span className='text-gray-400'>250.00LKR</span> per item</p>
              </div>
            </div>

            <div className='md:w-1/2 flex flex-col md:flex-row md:items-center md:justify-around gap-2 mt-4 md:mt-0'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>

              {/* ****************/}
              <div className='flex gap-2 flex-wrap md:justify-end'>
                <button
                  onClick={loadOrderData}
                  className='border px-4 py-2 text-sm rounded-sm cursor-pointer font-semibold'
                >
                  Track Order
                </button>

                {/* Show only if Delivered */}
                {item.status === "Delivered" ? (
                  <>
                    <button
                      onClick={() => navigate('/exchange-info', { state: { product: item } })}
                      className='border px-4 py-2 text-sm rounded-sm cursor-pointer font-semibold bg-yellow-200'
                    >
                      Exchange
                    </button>
                    <button
                      onClick={() => navigate('/refund-info', { state: { product: item } })}
                      className='border px-4 py-2 text-sm rounded-sm cursor-pointer font-semibold bg-red-200'
                    >
                      Refund
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm italic">Refund/Exchange available after delivery</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Feedback Link */}
      <div className="mt-10 text-center">
        <button
          onClick={() => setShowFeedback(true)}
          className="border px-4 py-2 text-sm rounded-sm cursor-pointer font-semibold bg-blue-200"
        >
          Give Feedback
        </button>
      </div>

      {/* Feedback Box */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">We value your feedback</h2>

            {/* Q1: Product satisfaction */}
            <label className="block mb-2 text-sm">1. How satisfied are you with the product?</label>
            <select
              name="q1"
              value={form.q1}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="">Select</option>
              <option value="Very Satisfied">Very Satisfied</option>
              <option value="Satisfied">Satisfied</option>
              <option value="Neutral">Neutral</option>
              <option value="Dissatisfied">Dissatisfied</option>
              <option value="Very Dissatisfied">Very Dissatisfied</option>
            </select>

            {/* Q2: Delivery satisfaction */}
            <label className="block mb-2 text-sm">2. How satisfied are you with the delivery service?</label>
            <select
              name="q2"
              value={form.q2}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="">Select</option>
              <option value="Very Satisfied">Very Satisfied</option>
              <option value="Satisfied">Satisfied</option>
              <option value="Neutral">Neutral</option>
              <option value="Dissatisfied">Dissatisfied</option>
              <option value="Very Dissatisfied">Very Dissatisfied</option>
            </select>

            {/* Q3: Payment experience */}
            <label className="block mb-2 text-sm">3. Was the payment process smooth?</label>
            <select
              name="q3"
              value={form.q3}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="">Select</option>
              <option value="Very Smooth">Very Smooth</option>
              <option value="Smooth">Smooth</option>
              <option value="Neutral">Neutral</option>
              <option value="Problematic">Problematic</option>
              <option value="Very Problematic">Very Problematic</option>
            </select>

            {/* Q4: Suggestions */}
            <label className="block mb-2 text-sm">4. Any suggestions for improvement?</label>
            <textarea
              name="q4"
              value={form.q4}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            ></textarea>

            <div className="flex justify-between">
              <button
                onClick={() => setShowFeedback(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  )
}

export default Orders;
