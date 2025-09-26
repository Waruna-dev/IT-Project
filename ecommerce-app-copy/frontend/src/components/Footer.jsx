import React from 'react'
import { assets } from '../assets/assets'
import { FaFacebookF, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';


const Footer = () => {
    return (
        <div>  {/** */}
            <div className="my-10 mt-40 text-sm flex flex-col sm:flex-row sm:justify-between items-center sm:items-start gap-10 flex-wrap text-center sm:text-left">

                {/* 👇 LOGO + Description */}
                <div className="sm:w-1/4 min-w-[200px]">
                    {/* 👇 Center the image on small screens */}
                    <img src={assets.logo} className="mb-5 w-32 mx-auto sm:mx-0 cursor-pointer" alt="" />

                    <p className="text-gray-600">
                        From casual essentials to standout statement pieces, our collections are designed to inspire confidence.
                        Enjoy secure shopping, fast delivery, and dedicated support—because you deserve the best.
                    </p>
                </div>

                {/* 👇 COMPANY section */}
                <div className="sm:w-1/5 min-w-[150px]">
                    <p className="text-xl font-medium mb-5">STORE</p>
                    <ul className="flex flex-col gap-1 text-gray-600 cursor-pointer ">
                        <li className='hover:text-black transition'>Home</li>
                        <li className='hover:text-black transition'>About Us</li>
                        <li className='hover:text-black transition'>Delivery</li>
                        <li className='hover:text-black transition'>Privacy Policy</li>
                    </ul>
                </div>

                {/* 👇 FOLLOW US with icons vertically centered */}
                <div className="sm:w-1/5 min-w-[150px]">
                    <p className="text-xl font-medium mb-5">FOLLOW US</p>

                    {/* 👇 Add items-center to align icons center on mobile, left on desktop */}
                    <div className="flex  gap-4 items-center justify-center sm:justify-start   text-gray-600 text-2xl">
                        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="hover:text-green-600 transition" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className="hover:text-blue-600 transition" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaXTwitter className="hover:text-black transition" />
                        </a>
                    </div>
                </div>

                {/* 👇 GET IN TOUCH */}
                <div className="sm:w-1/5 min-w-[150px]">
                    <p className="text-xl font-medium mb-5 hover:text-black transition cursor-pointer">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-1 text-gray-600 ">
                        <li className='cursor-pointer hover:text-black transition '>+94761123453</li>
                        <li className='cursor-pointer hover:text-black transition '>Madushanka@gmail.com</li>
                    </ul>
                </div>

            </div>

            <div>
                <hr className='h-[1px] bg-gray-300 border-0 my-2' />
                <p className='py-5 text-sm text-center'>Copyright 2025@ HarshaFashion.com - All right recieved.</p>
            </div>
        </div>
    )
}

export default Footer
