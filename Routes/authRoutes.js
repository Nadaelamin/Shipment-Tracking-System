const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// مسار للتسجيل
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).send('User already exists.');

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// مسار لتسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials.');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).send('Invalid credentials.');

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
