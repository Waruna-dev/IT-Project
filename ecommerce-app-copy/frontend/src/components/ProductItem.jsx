import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id,image,name,price}) => {

    const {currency} = useContext(ShopContext)
  return (
    <Link className = 'text-gray-700 cursor-pointer border border-amber-700 p-0.5 rounded-md hover:shadow-md transition text-center' to = {`/product/${id}`}>
        <div className='overflow-hidden flex justify-center'>
            <img className= 'transition ease-in-out transform hover:scale-110 duration-300 rounded-md' src= {image[0]} alt="" />
        </div>
        <p className='p-0.5 pt-3 pb-1 text-sm'>{name}</p>
        <p className='p-0.5 text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem

