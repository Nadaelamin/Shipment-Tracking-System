const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// تعريف schema للمستخدم
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// تشفير كلمة المرور قبل حفظ المستخدم في قاعدة البيانات
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// دالة للمقارنة بين كلمة المرور المدخلة وكلمة المرور المشفرة
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// إنشاء الموديل
const User = mongoose.model('User', userSchema);

module.exports = User;
