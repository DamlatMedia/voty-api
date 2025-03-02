import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import Student from "../models/studentModel.js"

//  const authMiddleware = (req, res, next) => {
  
//   // Extract the token from the Authorization header
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       status: "error",
//       message: "No token provided!",
//     });
//   }

//   try {
//     // Verify the token and decode the payload
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Attach user information to the request object
//     req.user = decoded;

//     if (!req.user) {
//       return res.status(401).json({ message: "User not found" });
//     }
    
//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       status: "error",
//       message: "Invalid or expired token",
//     });
//   }
// };

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token); // Log to debug

  if (!token) {
    return res.status(401).json({ status: "error", message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }
};


export default authMiddleware;

