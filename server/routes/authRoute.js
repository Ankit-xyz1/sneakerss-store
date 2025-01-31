import express from 'express';
import {signup,login,logout,sendVerifyOtp,verifyOtp, isLoggedIn} from '../controllers/authcontroller.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const auth = express.Router();

auth.post('/signup',signup)
auth.post('/login',login)
auth.post('/logout',logout)
auth.post('/sendotp',sendVerifyOtp)
auth.post('/verifyotp',verifyOtp)
auth.post('/loggedin',isAuthenticated, isLoggedIn)

export default auth