const express = require('express');
const route = express.Router();
const authMiddleware = require('../middleware/authService');
const superadmin = require('../middleware/Superadmin')
const {singleUpload } = require('../utils/multer')
const userController = require('../controllers/userController');




route.post('/register',userController.userRegister);

route.get('/login', userController.userLogin);

route.patch('/users/:user_id',authMiddleware,singleUpload, userController.updateUser);

route.delete('/users/:user_id',authMiddleware, userController.deleteUser);

route.get('/superadmin/:user_id', authMiddleware, superadmin, userController.getSuperadmin);


module.exports=route

