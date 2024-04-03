const express = require('express');
const route= express.Router();
const courseController = require('../controllers/courseController');

route.post('/courses', courseController.createCourse);

route.get('/courses', courseController.getAllCourses);

route.get('/courses/:course_id',courseController.getCourseById);

route.patch('/courses/:course_id', courseController.updateCourse);

route.delete('/courses/:course_id');

module.exports = route