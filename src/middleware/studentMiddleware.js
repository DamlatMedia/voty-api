import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";

const studentMiddleware = async (req, res, next) => {
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

// import jwt from "jsonwebtoken";

// const studentMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ status: "error", message: "No token provided" });
//   }
  
//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ status: "error", message: "No token provided" });
//   }
  
//   console.log("Received token:", token);
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Fetch the student document including the username.
//     const student = await Student.findById(decoded.id).select("_id username");
//     if (!student) {
//       return res.status(401).json({ status: "error", message: "User not found" });
//     }
//     req.user = student;
//     next();
//   } catch (error) {
//     console.error("Error in student middleware:", error);
//     return res
//       .status(401)
//       .json({ status: "error", message: "Invalid or expired token", error: error.message });
//   }
// };

// export default studentMiddleware;
