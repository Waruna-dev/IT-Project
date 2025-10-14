import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default verifyToken;
