import jwt from "jsonwebtoken";
import Student from "../models/scholarshipModel.js";

 const studentMiddleware = async (req, res, next) => 
  
//   {

//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await Student.findById(decoded.id).select("_id name"); // Attach user
//     if (!req.user) return res.status(401).json({ message: "Invalid token" });

//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token", error: error.message });
//   }
// };

 {
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
export default studentMiddleware;