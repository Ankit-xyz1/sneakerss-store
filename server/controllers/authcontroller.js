import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import configDotenv from "dotenv";
import userModel from "../models/userModel.js";
import transporter from "../config/mail.js";
import { text } from "express";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  //validations
  if (!name || !email || !password) {
    return res.json({ sucess: false, message: "feilds are missing" });
  }

  //finding if user already exists
  const userAlreadyExist = await userModel.findOne({ email: email });
  if (userAlreadyExist) {
    return res.json({ sucess: false, message: "user already exist" });
  }

  //if not securing the password and creating the user
  const SecurePassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: SecurePassword,
  });

  //sending a jwt to user
  let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
  const mailoptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: email,
    subject: "Welcome to sneakers",
    text: `welcome to sneakers ${user.name} , Dont forget to verify email your ${user.email}`,
  };
  await transporter.sendMail(mailoptions);
  return res.json({ sucess: true, message: "User created" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email || !password) {
    return res.json({ sucess: false, message: "feilds are missing" });
  }

  //finding the user
  const LoggedInuser = await userModel.findOne({ email: email });

  //if user not found returning him
  if (!LoggedInuser) {
    return res.json({ sucess: false, message: "email or password is wrong" });
  }

  //if user found checking for the password is same or not
  try {
    let PassIsCorrect = await bcrypt.compare(password, LoggedInuser.password);
    if (!PassIsCorrect) {
      return res.json({ sucess: false, message: "email or password is wrong" });
    }
    //if password is correct sending a jwt cookie
    let token = jwt.sign({ id: LoggedInuser._id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({ sucess: true, message: "User loggedIn" });
  } catch (error) {
    return res.json({ sucess: false, error, message: "eroor occured" + error });
  }
};

//logout
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ sucess: true, message: "loggedOut sucessFully" });
};

//sending the otp for verification
export const sendVerifyOtp = async (req, res) => {
  //acessing the cookie and decoding jwt to find the user
  const token = req.cookies.token;
  const data = jwt.verify(token, process.env.SECRET_KEY);

  //vaidations if jwt is wornng or expred return user and ask to login
  if (!data) {
    return res.json({ sucess: false, message: "please login again" });
  }

  //finding the current user
  let currentUser = await userModel.findOne({ _id: data.id });

  //checkinng if user is already verified return him
  if (currentUser.isVerified) {
    return res.json({ sucess: false, message: "youre already verified" });
  }

  //checking if user is just spamming mails
  if (currentUser.mailCount >= 4) {
    return res.json({ sucess: false, message: "try again later" });
  }

  //genrating otp
  let otp = Math.floor(Math.random() * 900000 + 100000);

  //storing otp to database
  currentUser.verificationOTP = otp.toString();
  await currentUser.save();

  // configuring mail
  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: currentUser.email,
    subject: "otp for your verification",
    text: `the otp is <h2>${otp}<h2>`,
  };
  //sending the mail
  await transporter.sendMail(mailOptions);

  //increasing the mail count so no ones spams the email
  currentUser.mailCount = currentUser.mailCount + 1;
  await currentUser.save();

  return res.json({ sucess: true, message: "the otp is sended sucessfully" });
};

//otp verification

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  console.log(otp);
  const token = req.cookies.token;
  const data = jwt.verify(token, process.env.SECRET_KEY);
  let currentUser = await userModel.findOne({ _id: data.id });
  if (currentUser.mailCount >= 4) {
    return res.json({ sucess: false, message: "try again later" });
  }
  if (currentUser.isVerified) {
    return res.json({ sucess: false, message: "youre already verified" });
  }
  if (otp == currentUser.verificationOTP) {
    currentUser.isVerified = true;
    await currentUser.save();
    return res.json({ sucess: true, message: "you're verified now" });
  } else {
    return res.json({ sucess: false, message: "the otp is not matched" });
  }
  return res.json({ sucess: false, message: "something went wrong" });
};

//check the user is logged in

export const isLoggedIn = async (req, res) => {
  let id = req.CurrrentUser.id;
  let Cuser = await userModel.findOne({ _id: id });
  // let Cuser = await userModel.findOne({ _id: id }).populate('haveCourses','name img by _id');
  if (!Cuser) {
    res.json({ sucess: false, message: "no current user found" });
  }
  console.log(Cuser);
  res.json({
    sucess: true,
    message: "youre authenticated",
    name: Cuser.name,
    email: Cuser.email,
    verified: Cuser.isVerified,
    courses:Cuser.haveCourses,
  });
};
