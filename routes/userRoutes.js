const express = require('express');
const route = express.Router();
const authMiddleware = require('../services/authService');


const userController = require('../controllers/userController');


route.post('/register',userController.userRegister);

route.get('/users',userController.getUsers);

route.get('/users/:user_id',authMiddleware, userController.getUserById);

route.patch('/users/:user_id',authMiddleware, userController.updateUser);

route.delete('/users/:user_id',authMiddleware, userController.deleteUser);

// route.get('/superadmin/:user_id', userRoutes.getSuperadmin);

// // User Login
// router.post('/login', userController.loginUser);

module.exports=route

