import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add.jsx';
import List from './pages/List.jsx';
import Orders from './pages/Orders.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import StaffLogin from './components/StaffLogin.jsx';
import DeliveryLogin from './components/DeliveryLogin.jsx';
import Exchange from './pages/staff/Exchange.jsx';
import Refund from './pages/staff/Refund.jsx';
import DeliveryInfo from './pages/delivery/DeliveryInfo.jsx';
import Update from './pages/Update';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

//add user
import Adduser from './pages/Umanage/Adduser.jsx';
import Showuser from './pages/Umanage/Showuser.jsx';

/////
import Myprofile from './pages/Myprofile.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'LKR';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('token', token);
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
                if (window.location.pathname.startsWith('/login')) {
                    if (decodedToken.role === 'admin') navigate('/list');
                    else navigate('/orders');
                }
            } catch (error) {
                console.error('Failed to decode token:', error);
                setToken('');
                localStorage.removeItem('token');
            }
        } else {
            if (!window.location.pathname.startsWith('/login')) {
                navigate('/login/staff');
            }
        }
    }, [token, navigate]);

    const renderDashboard = () => (
        <>
            <Navbar setToken={setToken} />
            <hr className='mt-3 border-gray-300' />
            <div className='flex w-full'>
                <Sidebar />
                <div className='w-[75%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                    <Routes>

                        <Route path="/myprofile" element={<Myprofile token={token} />} />
                        
                        {/* Orders */}
                        <Route
                            path='/'
                            element={['admin', 'staff', 'delivery'].includes(userRole) ? <Orders token={token} /> : <h1>Not Authorized</h1>}
                        />
                        <Route
                            path='/orders'
                            element={['admin', 'staff', 'delivery'].includes(userRole) ? <Orders token={token} /> : <h1>Not Authorized</h1>}
                        />

                        {/* Admin only */}
                        <Route path='/add' element={userRole === 'admin' ? <Add token={token} /> : <h1>Not Authorized</h1>} />
                        <Route path='/list' element={userRole === 'admin' ? <List token={token} /> : <h1>Not Authorized</h1>} />
                        <Route path='/update/:id' element={userRole === 'admin' ? <Update token={token} /> : <h1>Not Authorized</h1>} />

                        <Route path='/adduser' element={userRole === 'admin' ? <Adduser token={token} /> : <h1>Not Authorized</h1>} />

                        <Route
                            path='/showuser'
                            element={userRole === 'admin' ? <Showuser token={token} /> : <h1>Not Authorized</h1>}
                        />
                        
                        {/* Staff + Admin */}
                        <Route path='/exchange' element={(userRole === 'admin' || userRole === 'staff') ? <Exchange token={token} /> : <h1>Not Authorized</h1>} />
                        <Route path='/refund' element={(userRole === 'admin' || userRole === 'staff') ? <Refund token={token} /> : <h1>Not Authorized</h1>} />

                        {/* Delivery */}
                        <Route path='/deliveryinfo' element={(userRole === 'admin' || userRole === 'delivery') ? <DeliveryInfo token={token} /> : <h1>Not Authorized</h1>} />
                    </Routes>
                </div>
            </div>
        </>
    );

    return (
        <div className='bg-gray-50 min-h-screen'>
            <ToastContainer />
            {token ? (
                renderDashboard()
            ) : (
                <Routes>
                    <Route path='/login/admin' element={<AdminLogin setToken={setToken} />} />
                    <Route path='/login/staff' element={<StaffLogin setToken={setToken} />} />
                    <Route path='/login/delivery' element={<DeliveryLogin setToken={setToken} />} />
                    <Route path='*' element={<StaffLogin setToken={setToken} />} />
                </Routes>
            )}
        </div>
    );
};

export default App;
