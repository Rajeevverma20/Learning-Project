const express = require('express');
const route = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authService');

route.post('/enrollments',authMiddleware,  enrollmentController.enroll);

route.get('/enrollments/:user_id',authMiddleware,  enrollmentController.getCourseByUser);

module.exports= route;