import express from 'express';
import {signup,login,logout,sendVerifyOtp,verifyOtp} from '../controllers/authcontroller.js'

const auth = express.Router();

auth.post('/signup',signup)
auth.post('/login',login)
auth.post('/logout',logout)
auth.post('/sendotp',sendVerifyOtp)
auth.post('/verifyotp',verifyOtp)

export default auth