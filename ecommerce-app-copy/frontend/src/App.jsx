import React from 'react'
import { Routes, Route, } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import Verify from './pages/Verify.jsx'

//
import ExchangeInfo from './pages/ExchangeInfo.jsx';
import RefundInfo from './pages/RefundInfo.jsx';

{/**import StaffApp from '../../staff/src/pages/App';
import OwnerApp from '../../owner/src/pages/App'; 
import DeliveryApp from '../../delivery/src/App.jsx';*/}


export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {
  return (
    <div className='px-4 sm:px-[5vm] md:px-[7vw] lg:px-[9vw] bg-gray-100 '>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Verify />} />
        {/* ...other routes */}
        <Route path="/exchange-info" element={<ExchangeInfo />} />
        <Route path="/refund-info" element={<RefundInfo />} />

      </Routes>
      <Footer />
    </div>
  )
}
export default App
