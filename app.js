//المكتبات اللي هنستخدمها 
const express = require('express');
const mongoose =require('mongoose');
const app = express();
const path = require('path')
//اعدادات EJS القوالب 
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname,'public')));
//الاتصال بالداتا بيز
mongoose.connect('mongodb://127.0.0.1:27017/shipmentDB')
.then(() =>console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error',err));
//الصفحة الرئيسية
app.get('/',(req,res)=>{
    res.render('home');
});

const trackingRoutes = require('./routes/tracking'); // المسار صحيح لأن app.js بجذر المشروع
app.use('/', trackingRoutes);                        // يفعّل جميع المسارات داخل tracking.js



//تشغيل السيرفر
app.listen(3000, () => {
    console.log('server is running on http://localhost:3000 🚀');
});
