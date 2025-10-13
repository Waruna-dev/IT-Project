import express from 'express';
import { loginUser, adminLogin, registerUser, staffLogin, deliveryLogin, addUser, getAllUsers, updateUser, deleteUser} from '../controllers/userController.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import roleAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
//
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter =  express.Router()

userRouter.post('/register' , registerUser);
userRouter.post('/login' , loginUser);
userRouter.post('/admin' , adminLogin);
userRouter.post('/staff', staffLogin);
userRouter.post('/delivery', deliveryLogin);

//
userRouter.post('/add', addUser);

////
userRouter.get('/list',roleAuth('admin'), getAllUsers);
userRouter.put('/update/:id', roleAuth('admin'), updateUser);
userRouter.delete('/delete/:id', roleAuth('admin'), deleteUser);


// profile routes (common for all roles)
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, updateProfile);


export default userRouter;
