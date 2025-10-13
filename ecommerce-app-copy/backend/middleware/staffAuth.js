// backend/middleware/staffAuth.js (create a new file)
import jwt from 'jsonwebtoken';

const staffAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not authorized. Please login again.' });
        }

        // 1. Verify the token with the secret
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Check if the decoded payload has the staff role
        if (token_decode.role !== 'staff') {
            return res.json({ success: false, message: 'Not authorized. This is a staff-only resource.' });
        }
        
        // Optionally, attach user info to the request for later use
        req.userId = token_decode.id;
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Authentication failed.' });
    }
};

export default staffAuth;