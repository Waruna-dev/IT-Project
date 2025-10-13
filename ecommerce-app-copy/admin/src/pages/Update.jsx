import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Update = ({ token }) => {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  //new added for validate
  const [errors, setErrors] = useState({});

  //validation for
  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required.";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!price) {
      newErrors.price = "Product price is required.";
    } else if (isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  ///////


  const fetchProduct = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
      if (res.data.success) {
        const product = res.data.product;
        setName(product.name);
        setPrice(product.price);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch product.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;   //  Stop submission if validation fails

    try {
      const res = await axios.post(`${backendUrl}/api/product/update`, {
        id,
        name,
        price,
      }, {
        headers: { token }
      });

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  //under validation name has at least 3 characters, price positive

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold">Update Product</h2>


      <div>
        <label className="block mb-1">Product Name</label>
        <input
          type="text"
          className="border px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block mb-1">Product Price</label>
        <input
          type="number"
          className="border px-3 py-2 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>




      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded mt-2 cursor-pointer">
        Update Product
      </button>
    </form>
  );
};

export default Update;
