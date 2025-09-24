// ExchangeInfo.jsx
import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext.jsx';

const ExchangeInfo = () => {
  const { state } = useLocation();
  const { backendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const product = state?.product;

  const [formData, setFormData] = useState({
    reason: '',
    quantity: product?.quantity || 1,
    preferredReplacement: '',
    phone: '',
    email: '',
    address: '',
    exchangeMethod: '',
    pickupDateTime: '',
    agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ADDED VALIDATION 1: Phone number format validation
    const phoneRegex = /^\d{10,15}$/; // A simple regex for 10-15 digit phone numbers
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid phone number (10-15 digits).');
      return;
    }

    // ADDED VALIDATION 2: Quantity check
    if (formData.quantity <= 0 || formData.quantity > product.quantity) {
      alert(`Please enter a valid quantity between 1 and ${product.quantity}.`);
      return;
    }

    // ADDED VALIDATION 3: Pickup time validation
    if (formData.exchangeMethod === 'pickup' && !formData.pickupDateTime) {
      alert('Please select a pickup date and time.');
      return;
    }

    if (!formData.agree) {
      alert('Please agree to the exchange policy.');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/exchange/create`, {
        ...formData,
        product
      }, { headers: { token } });
      alert('Exchange request submitted!');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Failed to submit exchange request. Please try again.');
    }
  };

  if (!product) return <p>No product found.</p>;

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Exchange Request</h2>
      
      {/* Product Info */}
      <div className='flex gap-4 border-b pb-4 mb-4'>
        <img src={product.image[0]} alt={product.name} className='w-20 h-20 object-cover'/>
        <div>
          <p className='font-semibold'>{product.name}</p>
          <p>{currency}{product.price.toFixed(2)}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Size: {product.size}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <textarea name="reason" placeholder="Reason for exchange" value={formData.reason} onChange={handleChange} className='border p-2 w-full' required />
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className='border p-2 w-full' required />
        <input type="text" name="preferredReplacement" placeholder="Preferred replacement" value={formData.preferredReplacement} onChange={handleChange} className='border p-2 w-full' />
        <input type="text" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} className='border p-2 w-full' required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className='border p-2 w-full' required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className='border p-2 w-full' required />

        <select name="exchangeMethod" value={formData.exchangeMethod} onChange={handleChange} className='border p-2 w-full' required>
          <option value="">Select exchange method</option>
          <option value="pickup">Pickup from my address</option>
          <option value="dropoff">Drop off at store</option>
        </select>

        {formData.exchangeMethod === 'pickup' && (
          <input type="datetime-local" name="pickupDateTime" value={formData.pickupDateTime} onChange={handleChange} className='border p-2 w-full' required />
        )}

        <label className='flex items-center gap-2'>
          <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} />
          I have read and agree to the exchange policy.
        </label>

        <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>Submit Exchange</button>
        <p className='pt-1.5 pb-1.5 text-red-600'>Please be noted after the week from the purchase we will ignore the exchange requests.</p>
      </form>
    </div>
  );
};

export default ExchangeInfo;