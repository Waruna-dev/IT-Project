import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { NavLink } from 'react-router-dom';


const List = ({ token }) => {

  //get the data from api

  const [list, setList] = useState([])


  const fetchList = async () => {

    try {
      //call api
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products); //add the product to the list
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  //remove product

  const removeProduct = async (id) => {

    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } }) //call remove api

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchList()
  }, [])


  //using list dislay the product
  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/*********List Table Title***** */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-200 bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/*******product list */}

        {
          list.map((item, index) => (

            < div className='grid grid-cols-[1fr_4fr_auto] md:grid-cols-[1fr_3fr_1fr_1fr_auto_auto] items-center gap-x-4 gap-y-2 py-2 px-2 border border-gray-300 text-sm' key={item._id} >

              <img className='w-12' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p className='hidden md:block'>{item.category}</p> {/* Hides category on small screens for a cleaner look */}
              < p className='hidden md:block' > {currency}{` ${item.price.toFixed(2)}`}</p> {/* Hides price on small screens */}

              {/* The Update button is now before the Remove button */}
              <NavLink
                to={`/update/${item._id}`}
                className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs cursor-pointer text-center"
              >
                Update
              </NavLink>

              <p onClick={() => removeProduct(item._id)} className='cursor-pointer text-lg text-center'>X</p>

            </div >


          ))
        }

      </div >
    </>
  )
}

export default List
