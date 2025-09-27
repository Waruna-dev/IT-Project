import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const [currentState, setCurrentState] = useState('Login')
    //login token
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

    //fetch signup form details
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (currentState === 'Sign Up') {

                // ADDED VALIDATION 1: Name length check
                if (name.length < 3) {
                    toast.error("Name must be at least 3 characters long.");
                    return;
                }

                // ADDED VALIDATION 2: Password strength check
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                if (!passwordRegex.test(password)) {
                    toast.error("Password must be at least 8 characters, including an uppercase letter, a lowercase letter, and a number.");
                    return;
                }

                // ADDED VALIDATION 3: Email format check
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    toast.error("Please enter a valid email address.");
                    return;
                }

                //call register api
                const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)

                } else {
                    toast.error(response.data.message)
                }
            } else {
                // call login api
                const response = await axios.post(backendUrl + '/api/user/login', { email, password })

                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('role', response.data.role)  // Save role
                } else {
                    toast.error(response.data.message)
                }

            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => { //when token available navigate to the home page
        if (token) {
            const userRole = localStorage.getItem('role');
            switch (userRole) {
                case 'staff':
                    navigate('/staff');
                    break;
                case 'owner':
                    navigate('/owner');
                    break;
                case 'delivery':
                    navigate('/delivery');
                    break;
                default:
                    navigate('/');  // customer
            }
        }
    }, [token])




    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='unlock-regular text-3xl'>{currentState}</p>
                <hr className='border-none h-[2px] w-8 bg-gray-800' />
            </div>
            {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-3 py-2 border border-gray-800' placeholder='Name' type="text" required />}
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-3 py-2 border border-gray-800' placeholder='Email' type="email" required />
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-3 py-2 border border-gray-800' placeholder='Password' type="password" required />
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Fogot Your Password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
                        : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
                }
            </div>
            <button className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer'>{currentState === 'Login' ? 'Sign in' : 'Sign Up'}</button>
        </form>
    )
}

export default Login