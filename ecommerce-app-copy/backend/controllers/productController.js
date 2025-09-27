import { v2 as cloudinary } from "cloudinary"
import productModel from '../models/productModel.js'



// function for add product

const addProduct = async (req, res) => {

   try {

      const { name, description, price, category, subCategory, sizes, bestseller } = req.body  // get the product data 

      //validate part

       // Validation 1: Required fields
      if (!name || !price || !category) {
         return res.json({ success: false, message: "Name, price, and category are required." });
      }

      // Validation 2: Price must be a positive number
      if (isNaN(price) || Number(price) <= 0) {
         return res.json({ success: false, message: "Price must be a valid positive number." });
      }
/////////////////////

      const image1 = req.files.image1 && req.files.image1[0] // get the first element image1              // get the images          checking image1 is available in reqest files then store that image in image1 variable
      const image2 = req.files.image2 && req.files.image2[0]
      const image3 = req.files.image3 && req.files.image3[0]
      const image4 = req.files.image4 && req.files.image4[0]


      //images can not store in the database; so that upload images in cloudinary and get its url and store it in db

      const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

      //create the cloudinary link to access the image 
      let imageUrl = await Promise.all(
         images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url
         })
      )

      //
      // console.log(name, description, price, category, subCategory, sizes, bestseller);
      // console.log(imageUrl); //get the links of 4 images which stored in cloudinary 
      //


      const productData = {
         name,
         description,
         category,
         price: Number(price), // in form data price is as string, convert it to number
         subCategory,
         bestseller: bestseller === "true" ? true : false, //in form data price is as string, convert it to number
         sizes: JSON.parse(sizes),//can not snd the array directly as form data, so converting it from string to array using json.pars
         image: imageUrl,
         date: Date.now()
      }

      console.log(productData);

      const product = new productModel(productData);
      await product.save()

      res.json({ success: true, message: "Product added." })
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }

}

//function for list products

const listProducts = async (req, res) => {

   try {
      const products = await productModel.find({});
      res.json({ success: true, products })

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}


//function for remove product
const removeProduct = async (req, res) => {

   try {
      await productModel.findOneAndDelete({ _id: req.body.id }); //req.body.id changed this
      res.json({ success: true, message: "Product removed." })
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}

//function for sinle product get data of product
const singleProduct = async (req, res) => {
   try {

      const { productId } = req.body
      const product = await productModel.findById(productId)
      res.json({ success: true, product })

   } catch (error) {
      
      console.log(error);
      res.json({ success: false, message: error.message })
   }

}

//update product price and name
const updateProduct = async (req, res) => {
   try {
     const { id, name, price } = req.body;
 
     if (!id || !name || !price) {
       return res.json({ success: false, message: "Missing required fields" });
     }
 
     const product = await productModel.findById(id);
     if (!product) {
       return res.json({ success: false, message: "Product not found" });
     }
 
     product.name = name;
     product.price = Number(price);
     product.date = Date.now(); // optional: update timestamp
 
     await product.save();
 
     res.json({ success: true, message: "Product updated successfully." });
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }
 };
 

///


export { addProduct, removeProduct, listProducts, singleProduct, updateProduct }























