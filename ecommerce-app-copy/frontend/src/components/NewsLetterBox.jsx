import React from 'react'

const NewsLetterBox = () => {


const onSubmitHandler = (event) =>{
    event.preventDefault();
}



    return (
        <div className='text-center mt-7'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 10% OFF</p>
            <p className='text-gray-600 mt-3'>Be the first to know about new arrivals, exclusive deals, and more.</p>
            <form onSubmit  ={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded-md'>
                <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
                <button type='submit' className='bg-black text-white text-xs px-10 py-4 cursor-pointer'>SUBSCRIBE</button>
            </form>
        </div>
    )
}

export default NewsLetterBox
