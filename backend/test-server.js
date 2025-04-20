require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/admin');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Add a basic middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Mount the admin routes
app.use('/api/admin', adminRoutes);

// Add a simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working' });
});

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Test server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 