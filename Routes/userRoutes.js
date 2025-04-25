const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// تحميل المتغيرات البيئية من ملف .env
dotenv.config();

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // التحقق من وجود الحقول المطلوبة
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  // التحقق من صحة البريد الإلكتروني باستخدام تعبير منتظم
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // التحقق من وجود المستخدم بالفعل
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists.' });

    // تشفير كلمة المرور قبل حفظ المستخدم
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // التحقق من وجود الحقول المطلوبة
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // التحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // مقارنة كلمة المرور المدخلة مع الكلمة المخزنة
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // إنشاء توكن JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: { username: user.username, email: user.email }, // أضف تفاصيل المستخدم في الرد
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
