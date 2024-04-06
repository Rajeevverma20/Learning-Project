const express = require('express');
const route= express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authService');
const isSuperadmin = require('../middleware/Superadmin');

 route.post('/courses',authMiddleware, isSuperadmin, courseController.createCourse);

 route.get('/courses', courseController.getAllCourses);

 route.get('/courses/:course_id',courseController.getCourseById);

 route.patch('/courses/:course_id',authMiddleware, isSuperadmin, courseController.updateCourse);

 route.delete('/courses/:course_id',authMiddleware, isSuperadmin, courseController.deleteCourse);

module.exports = route