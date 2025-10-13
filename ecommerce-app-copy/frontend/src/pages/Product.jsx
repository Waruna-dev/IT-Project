import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')




  const fetchProductData = async () => {


    products.map((item) => {

      if (item._id == productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }


    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <div className='mt-7 border-t border-gray-300  pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/**product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/**product image ***************************/}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%]  sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>

          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>

        </div>

        {/**product inforation ***************************/}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>

          <p className='mt-5 text-3xl font-medium'>{currency}{` ${productData.price.toFixed(2)}`}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border px-3 py-2 bg-gray-100 ${item === size ? 'border-orange-600 border-4' : ''}`} key={index}> {item} </button>
              ))}
            </div>
          </div>

          <button onClick = {()=>addToCart(productData._id,size)}  className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5 border-t-2 border-gray-300' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% original product.</p>
            <p>Cash on delivery is available on this Product.</p>
            <p>Easy return and xchange policy within 7 days.</p>

          </div>
        </div>
      </div>

      {/*****************************Description and review section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className=' border border-gray-300 px-5 py-3 text-sm mr-2'>Description</b>
          <p className=' border border-gray-300 px-5 py-3 text-sm'>Reviews(122)</p>
        </div>
        <div className='mt-5 flex flex-col gap-4 border-t border-t-gray-300 px-6 py-6 text-sm text-gray-500'>
          <p>Step into effortless style with our thoughtfully curated clothing collection, designed to elevate your everyday look.
            Each garment is crafted using high-quality, breathable fabrics that ensure both comfort and durability throughout the day.
            From casual essentials to statement pieces, our collection is tailored for those who value confidence, individuality, and timeless fashion.</p>
          <p>Every piece in our collection is the result of expert craftsmanship, combining trend-driven design with classic silhouettes that suit every occasion.
            Whether you're dressing up for a night out or keeping it simple for a casual day, our apparel offers versatility, comfort, and style in equal measure.</p>
        </div>
      </div>
{/**display related product */}
<RelatedProducts category = {productData.category} subCategory  ={productData.subCategory}/>

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product

{/**3.9.10 */ }
