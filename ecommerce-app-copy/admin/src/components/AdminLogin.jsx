// admin/src/components/AdminLogin.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; // <-- Import Link

const AdminLogin = ({ setToken }) => {
  // ... state and onSubmitHandler remain the same ...
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-xl rounded-lg px-8 py-6 max-w-md border border-gray-60000'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>

        <form onSubmit={onSubmitHandler}>
          {/* ... input fields ... */}
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300' type="email" placeholder='your@email.com' required />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300' type="password" placeholder='Your password' required />
          </div>

          <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer' type='submit'>Login</button>
        </form>

        {/* The new section with the link */}
        <p className='mt-4 text-center text-sm text-gray-600'>
          Are you a Staff Member? {' '}
          <Link to="/login/staff" className='text-blue-600 hover:underline'>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;