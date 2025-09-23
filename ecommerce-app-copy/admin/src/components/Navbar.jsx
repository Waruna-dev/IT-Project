import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-4 px-[4%] justify-between relative'>
      <img className='w-30  cursor-pointer' src={assets.logo} alt="" />
      <p className="text-gray-600 text-xl absolute left-1/2 -translate-x-1/2 text-center hidden sm:block font-semibold"> DASHBOARD</p>
      <button onClick ={()=>setToken('')}  className='bg-gray-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
