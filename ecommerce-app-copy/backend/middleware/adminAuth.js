import jwt from 'jsonwebtoken';

const roleAuth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.json({ success: false, message: 'Not authorized. Please login again.' });
      }

      const token_decode = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(token_decode.role)) {
        return res.json({ success: false, message: 'Not authorized for this resource.' });
      }

      req.userId = token_decode.id;
      req.userRole = token_decode.role;

      next();
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Authentication failed.' });
    }
  };
};

export default roleAuth;
