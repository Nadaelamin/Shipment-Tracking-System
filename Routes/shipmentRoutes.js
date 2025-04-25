const express = require('express');
const router = express.Router();

// صفحة API لتتبع الشحنة
router.get('/la/hiv', (req, res) => {
    // نعيد استجابة JSON بدلاً من rendering لملف EJS
    res.json({ message: 'Welcome to the shipment tracking API.' });
});

module.exports = router;
