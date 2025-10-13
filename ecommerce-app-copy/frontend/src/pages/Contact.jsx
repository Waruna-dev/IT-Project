import React from 'react'
import Title from '../components/Title.jsx';
import { assets } from '../assets/assets.js';
import NewsLetterBox from '../components/NewsLetterBox.jsx';

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10  mt-7 border-t border-gray-300'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className = 'w-full md:max-w-[480px] border border-gray-800'src= {assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>201 / 1  Harsha Fashion Store <br />Heenatigala,Thalpe,Galle</p>
          <p className='text-gray-500'>Tel: +94761123453 <br />Email: Madushanka@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Harsha Fashion</p>
          <p className='text-gray-500'>Lear more about our crew and job openings</p>
          <button className='cursor-pointer border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default Contact
