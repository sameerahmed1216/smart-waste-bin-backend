const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

const router = express.Router();

// 🔐 Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // JWT Token generation
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload with user id and role
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    res.status(200).json({ token }); // Send token as response
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
});

// Route to create a new user (for testing purposes)
router.post('/create-user', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving it to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'admin', // Default role is admin
    });

    // Save new user to the database
    await newUser.save();

    res.status(200).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

module.exports = router; // Export routes
