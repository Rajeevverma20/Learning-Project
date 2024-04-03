const express = require('express');
const userRoutes= require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes')
const app = express();
const port = 8000;


app.use(express.json());

app.get('/', (req, res) => {
    // Handle GET request to /learning route
    res.send('Welcome to the learning platform');
  });

  app.use('/learning', userRoutes);
  app.use('/learning', courseRoutes);
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });