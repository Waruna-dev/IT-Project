// backend/middleware/deliveryAuth.js
import jwt from 'jsonwebtoken';

const deliveryAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not authorized. Please login again.' });
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check role
        if (token_decode.role !== 'delivery') {
            return res.json({ success: false, message: 'Not authorized. This is a delivery-only resource.' });
        }

        // Attach user info to request
        req.userId = token_decode.id;
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Authentication failed.' });
    }
};

export default deliveryAuth;
