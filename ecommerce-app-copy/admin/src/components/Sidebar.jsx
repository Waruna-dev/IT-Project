import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (              //changed this
        <div className='w-fit sm:w-[18%] min-h-screen border-r-2 border-gray-300'>
            <div className='flex flex-col gap-4 pt-6 pl-4 sm:pl-[20%] text-[15px]'>

                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/add'>
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Items</p>
                </NavLink>

                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/list'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/orders'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>


                {/** */}
                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/exchange'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Exchange</p>
                </NavLink>

                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/refund'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Refund</p>
                </NavLink>

                {/** */}

                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/deliveryinfo'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Delivery Info</p>
                </NavLink>

                {/** */}
                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/adduser'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Add a User</p>
                </NavLink>

                <NavLink className='flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2' to='/showuser'>
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Show User</p>
                </NavLink>


                <NavLink className="flex items-center gap-3 border border-gray-400 border-r-0 px-4 py-2" to="/myprofile">
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Update Profile</p>
                </NavLink>

                {/** */}

            </div>
        </div>

    )
}

export default Sidebar
