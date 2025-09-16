import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'
import Login from './components/Login.jsx'
import { ToastContainer} from 'react-toastify'; //toastify

//new
import Update from './pages/Update';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'LKR'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');  // when type something inside useState admin dashboard will be visible

//use use effect to use localstorage  so we not navigate back to the login page when reload

useEffect(()=>{

  localStorage.setItem('token',token)
},[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === "" ? <Login setToken = {setToken} /> :
        <>
          <Navbar setToken = {setToken}/>
          <hr className='mt-3 border-gray-300' />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[75%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token = {token}/>} />
                <Route path='/list' element={<List token = {token}/>} />
                <Route path='/orders' element={<Orders token = {token}/>} />
                <Route path="/update/:id" element={<Update token={token} />} />
              </Routes>
            </div>
          </div>
        </>}

    </div>
  )
}

export default App
