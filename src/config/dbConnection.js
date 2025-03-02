<<<<<<< HEAD
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected...");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };

// export default connectDB;

=======
>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab
import mongoose from "mongoose";

// connecting to database
export const  dbConnection = () =>{
    return mongoose.connect(process.env.MONGO_URI);
};