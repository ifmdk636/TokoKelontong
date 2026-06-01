import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load .env
dotenv.config({ path: "../.env" });

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "No Token Provided",
    });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

const authMid = {
  authMiddleware,
};

export default authMid;
