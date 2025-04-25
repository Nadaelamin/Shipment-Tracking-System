// استيراد المكتبات
const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment'); // تأكد من صحة مسار الموديل

// التعامل مع مسار التتبع
router.get('/track', async (req, res) => {
    // الحصول على كود التتبع
    const trackingCode = req.query.code;

    // التحقق من وجود كود التتبع
    if (!trackingCode) {
        return res.status(400).json({ message: "Please enter a tracking code." });
    }

    try {
        const shipment = await Shipment.findOne({ trackingCode });

        if (shipment) {
            // إعادة البيانات بتنسيق JSON بدلاً من إظهار صفحة
            res.json({ shipment });
        } else {
            res.status(404).json({ message: "No shipment found with this tracking code." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while tracking. Please try again later." });
    }
});

module.exports = router;
