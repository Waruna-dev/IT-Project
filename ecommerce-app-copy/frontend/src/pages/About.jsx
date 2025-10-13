import React from 'react'
import Title from '../components/Title.jsx';
import { assets } from '../assets/assets.js';
import NewsLetterBox from '../components/NewsLetterBox.jsx'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 mt-7 border-t border-gray-300'>
        <Title text1={'ABOUT'} text2={'US'}></Title>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px] border border-gray-600' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>We believe fashion should be effortless, expressive, and accessible. Our mission
            is to empower individuals through thoughtfully curated collections that blend everyday
            comfort with standout style. Whether you're dressing for casual days or special occasions,
          </p>
          <p> We provide high-quality, affordable pieces designed to inspire confidence and celebrate individuality.
            With a focus on customer satisfaction, sustainable practices, and the latest trends, we're more than a
            store — we're your go-to fashion destination.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to redefine everyday fashion by delivering high-quality,
            stylish, and affordable clothing that empowers self-expression. We aim to
            create a seamless shopping experience while promoting confidence, inclusivity,
            and sustainability in everything we do</p>
        </div>
      </div>

      <div className='text-2xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-2 '>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 text-center'>
          <b>Quality Assurance</b>
          <p><span className='text-3xl'>"</span>We take pride in the quality of every piece we offer, ensuring each product meets our high standards.
            From fabric selection to final stitching, every detail is carefully inspected for durability and comfort.
            Our commitment to quality means you receive clothing that looks great, feels great, and lasts longer.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 text-center'>
          <b>Convenience</b>
          <p><span className='text-3xl'>"</span>We are dedicated to making your shopping experience as smooth and effortless as possible.
            From easy navigation to fast delivery and flexible return options, everything is designed for your comfort.
            Shop anytime, anywhere — convenience is always at the heart of what we do.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 text-center'>
          <b>Exceptional Customer Service</b>
          <p><span className='text-3xl'>"</span>Our customers are at the core of everything we do, and their satisfaction is our top priority.
            We offer prompt, friendly, and reliable support to ensure every shopping experience is a positive one.
            From inquiries to after-sales care, we're here to help—every step of the way.</p>
        </div>


      </div>

<NewsLetterBox />

    </div>
  )
}

export default About
