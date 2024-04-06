const express = require('express');
const route = express.Router();
const authMiddleware = require('../middleware/authService');
//const multer = require('multer');
const {singleUpload } = require('../utils/multer')
const userController = require('../controllers/userController');


// const uploader = multer({
//     storage: multer.diskStorage({});
//     limits: {fileSize: 500000}
// })


route.post('/register',userController.userRegister);

route.get('/users',userController.getUsers);

route.get('/Login', userController.userLogin);

route.patch('/users/:user_id',authMiddleware,singleUpload, userController.updateUser);

route.delete('/users/:user_id',authMiddleware, userController.deleteUser);

// route.get('/superadmin/:user_id', userRoutes.getSuperadmin);

// // User Login
// router.post('/login', userController.loginUser);

module.exports=route

