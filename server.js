const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const binRoutes = require('./routes/binRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ 🔐 Login routes import
require('dotenv').config(); // 🔐 Load variables from .env file

// App initialization
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // 💾 MongoDB Atlas URI from .env

// 💥 Check if required env variables are set
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in your .env file!');
  process.exit(1); // Exit the process if MongoDB URI is missing
}

if (!PORT) {
  console.warn('⚠️ PORT is not defined, using default: 5000');
}

// 🛡️ Middleware
app.use(cors());           // Cross-Origin Resource Sharing
app.use(express.json());   // To parse incoming JSON requests

// 🚦 Routes
app.use('/api/bins', binRoutes);        // Bin-related API endpoints
app.use('/api/auth', authRoutes);       // ✅ Login route added

// 🏠 Root route
app.get('/', (req, res) => {
  res.send('✅ Smart Waste Bin Backend is running!');
});

// 🌐 MongoDB Connection
mongoose.connect(MONGO_URI, { dbName: 'SmartWasteBin' })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    
    // 🚀 Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);  // Exit the process if MongoDB connection fails
  });
