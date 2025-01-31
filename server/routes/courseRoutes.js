import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import {buyCourse, createCourse, FetchCourse, fetchCreatedCourse, fethcUserCourse, getCourse} from '../controllers/courseController.js'


const course = express.Router();

course.post('/createCourse',isAuthenticated,createCourse);
course.post('/fetchCourse',isAuthenticated,FetchCourse);
course.post('/getCourse',isAuthenticated,getCourse);
course.post('/buyCourse',isAuthenticated,buyCourse);
course.post('/userCourse',isAuthenticated,fethcUserCourse);
course.post('/fetchCreatedCourse',isAuthenticated,fetchCreatedCourse);



export default  course