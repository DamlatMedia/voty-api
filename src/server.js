// importing all dependencies needed for our express server
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet"; 
import httpStatus from "http-status";
import bodyParser from "body-parser";
import colors from "colors";
import videoRoutes from "./routes/videoRoutes.js";
import triviaRoutes from "./routes/triviaRoutes.js";
import Adminrouter from "./routes/adminRoutes.js";
import Studentrouter from "./routes/studentRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import { dbConnection } from "./config/dbConnection.js";

dotenv.config();


const app = express();

// 2. destructure and call our environment variables from .env
const { PORT, NODE_ENV } = process.env

// ✅ Configure CORS properly
app.use(
    cors({
      origin: "http://localhost:3000", // Allow frontend URL
      credentials: true, // Allow cookies and authentication headers
    })
  );
app.use(express.json());
app.use(helmet()); 
app.use(bodyParser.json());

// give condition to use morgan
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*"); // Allow image access
    },
  })
);

// specifying different routes for our server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    status: "success",
    message: "Welcome to my organization server!",
  });
});

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/trivia", triviaRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/student", Studentrouter);
app.use("/admin", Adminrouter);

  
//connecting to the database
dbConnection()
  .then(() => {
    console.log("Database connection established".bgMagenta);

    // setting a port for our server to listen on
    app.listen(PORT, () => {
      console.log(`Our sever is listening on ${PORT} in ${NODE_ENV}`.cyan); 
    });
  }) 
  .catch((error) => {
    console.error(`Database connection error: ${error}`);
  });
