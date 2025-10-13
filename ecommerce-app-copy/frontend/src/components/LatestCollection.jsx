import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);


    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products])



    console.log(products);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>           
                <Title text1={'LATEST'} text2={'COLLECTION'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Unveil a bold new season of style with our Latest Collection — where modern design meets effortless comfort.
                </p>
            </div>
            {/**rendering products */}

            {/**<div className='grid grid-col2 sm:grid-col-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    latestProducts.map((item,index)=>(
                        <ProductItem key={index} id={item._id} image={item.image} name = {item.name} price={` ${item.price.toFixed(2)}`}/> 
                    ))
                }
            </div> */}

            <div className='max-w-6xl mx-auto px-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
                    {
                        latestProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={` ${item.price.toFixed(2)}`} />
                        ))
                    }
                </div>

            </div>


        </div>
    )
}

export default LatestCollection
