const express = require('express');
const route = express.Router();

route.post('/enrollments');

route.get('/enrollments/:user_id');

module.exports= route;