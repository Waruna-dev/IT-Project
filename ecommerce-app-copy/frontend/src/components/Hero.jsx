import React from 'react'
import { assets } from '../assets/assets'


const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row  border-b-amber-700 mt-7 border-2 rounded-md'>
            {/**Hero left */}
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#414141] '>
                    <div className=' flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[3px] bg-[#414141]'></p>
                        <p className='font-medium text-medium md:text base'>ASK FROM PROFESSIONALS</p>
                    </div>
                    <h1 className='unlock-regular text-2xl sm:py-3 lg:text-4xl leading-relaxed'>"Wear your vibe.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Own your look"</h1>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-[3px] bg-[#414141]'></p>
                    </div>
                </div>
            </div>

            {/**Hero right */}
            <img className = 'w-full sm:w-1/2' src={assets.hero_img} alt="" />
        </div>
    )
}

export default Hero

{/**1.04.45 */}