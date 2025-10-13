//to add product with photos use multer

import multer from 'multer';

//name should storage
const storage = multer.diskStorage({

    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const upload = multer({storage})

export default upload