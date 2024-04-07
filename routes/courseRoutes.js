const express = require('express');
const route= express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authService');
const Superadmin = require('../middleware/Superadmin');

 route.post('/courses',authMiddleware, Superadmin, courseController.createCourse);

 route.get('/courses', courseController.getAllCourses);

 route.get('/courses/:course_id',courseController.getCourseById);

 route.patch('/courses/:course_id',authMiddleware, Superadmin, courseController.updateCourse);

 route.delete('/courses/:course_id',authMiddleware, Superadmin, courseController.deleteCourse);



 route.get('/coursesss', authMiddleware, courseController.getCourses);

module.exports = route