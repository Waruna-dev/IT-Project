import express from 'express'

import {addProduct, removeProduct, listProducts, singleProduct, updateProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import roleAuth from '../middleware/adminAuth.js';


const productRouter = express.Router();

//image 4 k admin add karana nisa e 4 ta adalawa feild method eka gannawa
productRouter.post('/add',roleAuth('admin'),upload.fields([{name:'image1',maxCount:1}, {name:'image2',maxCount:1}, {name:'image3',maxCount:1}, {name:'image4',maxCount:1}]),addProduct);// want to add images to the database so here using multer with feilds for malti part data
productRouter.post('/remove',roleAuth('admin'),removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts);
productRouter.post('/update', roleAuth('admin'), updateProduct);

export default productRouter;
