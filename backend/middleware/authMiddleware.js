const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // token present hai?
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Bearer <token>
    const token = authHeader.split(" ")[1];

    // token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // userId attach
    req.user = decoded.userId;

    next(); // request ko aage bhejo
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

