const express = require('express');
const route = express.Router();


const userRoutes = require('../controllers/userController');


route.post('/register',userRoutes.userRegister);

route.get('/users',userRoutes.getUsers);

route.get('/users/:user_id', userRoutes.getUserById);

route.patch('/users/:user_id', userRoutes.updateUser);

route.delete('/users/:user_id', userRoutes.deleteUser)



module.exports=route

