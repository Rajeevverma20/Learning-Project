const express = require('express');
const userRoutes= require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const app = express();
const port = 8000;


app.use(express.json());


app.use('/learning', userRoutes, courseRoutes, enrollmentRoutes);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });