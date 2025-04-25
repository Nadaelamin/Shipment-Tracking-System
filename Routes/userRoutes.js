// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.send('Logged in successfully');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Error logging in');
  }
});

module.exports = router;
