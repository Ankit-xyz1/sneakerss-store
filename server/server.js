// import required modules
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import configDotenv from "dotenv";
import DbConnect from "./config/mongooseConnection.js";
import userModel from "./models/userModel.js";
import auth from "./routes/authRoute.js";
import course from './routes/courseRoutes.js'


// express configuration
const app = express();
const port = "4000";

//some necessary middlewares
app.use(cors({origin:"http://localhost:5173", methods: 'GET,POST,PUT,DELETE', credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use('/auth',auth)
app.use('/course',course)

//connecting to db
DbConnect();

//basic api routes
app.get("/", (req, res) => {
  res.send({ message: "apis are working lets goo" });
});



//server starts
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
