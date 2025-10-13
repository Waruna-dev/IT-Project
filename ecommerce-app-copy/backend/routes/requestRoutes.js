import express from 'express';
import { submitExchangeRequest, submitRefundRequest,listExchangeRequests, listRefundRequests,removeExchangeRequest,removeRefundRequest } from '../controllers/requestController.js';
import authUser from '../middleware/auth.js'; // Your existing user authentication middleware

const requestRouter = express.Router();

// Route for submitting an exchange request  //create exchange and refund from user side
requestRouter.post('/exchange/create', authUser, submitExchangeRequest);

// Route for submitting a refund request
requestRouter.post('/refund/create', authUser, submitRefundRequest);


// New routes for fetching lists  //to display 
requestRouter.get('/exchange/list',  listExchangeRequests);
requestRouter.get('/refund/list',  listRefundRequests);


// UPDATED: Added authUser middleware to protect this route  //for remove
requestRouter.post('/exchange/remove', removeExchangeRequest);
requestRouter.post('/refund/remove', removeRefundRequest);

export default requestRouter;