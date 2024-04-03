const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Get Courses endpoint with filtering and pagination
router.get('/courses', courseController.getCourses);

// CRUD Operations for Superadmin
router.post('/courses', courseController.createCourse); // Create a new course
router.get('/courses/:courseId', courseController.getCourseById); // Read a course by ID
router.put('/courses/:courseId', courseController.updateCourseById); // Update a course by ID
router.delete('/courses/:courseId', courseController.deleteCourseById); // Delete a course by ID

module.exports = router;
