//JESUS

// importing all dependencies needed for our express server
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet"; 
import httpStatus from "http-status";
import bodyParser from "body-parser";
import colors from "colors";
import Adminrouter from "./routes/adminRoutes.js";
import Studentrouter from "./routes/studentRoutes.js";

// load our environment variables from the .env
// 1. configure dotenv
dotenv.config();

// importing all functions and middlewares
import { dbConnection } from "./config/dbConnection.js";

// creating an instance of express
const app = express();

// 2. destructure and call our environment variables from .env
const { PORT, NODE_ENV } = process.env;

// declare our servers's or express app general use
app.use(cors());
app.use(helmet()); 
app.use(bodyParser.json());


// give condition to use morgan
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// specifying different routes for our server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    status: "success",
    message: "Welcome to my organization server!",
  });
});


// admin base routes
app.use("/admin", Adminrouter);
app.use("/student", Studentrouter);

  
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
