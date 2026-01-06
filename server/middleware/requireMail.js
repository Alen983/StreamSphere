const jwt = require("jsonwebtoken");

const requireLogin = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("No authorization header provided");
    return res.status(401).json({
      message: "You have to log in to continue",
    });
  }

  // Extract token - handle both "Bearer token" and direct token formats
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return res.status(401).json({
        message: "You have to log in to continue",
      });
    }

    // Attach user info to request
    req.user = {
      _id: decoded.id, // Use _id for MongoDB compatibility
      id: decoded.id, // Keep id for backwards compatibility
      email: decoded.email,
    };

    console.log("Authenticated user:", req.user);
    next();
  });
};

module.exports = requireLogin;
