//استيراد المكتبات
const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment'); // Make sure the path to the model is correct
//التعامل مع مسار التتبع
router.get('/track', async (req, res) => {
    //الحصول علي كود التتبع
    const trackingCode = req.query.code;
    //التحقق من وجود كود التتبع
    if (!trackingCode) {
        return res.send("Please enter a tracking code.");
    }

    try {
        const shipment = await Shipment.findOne({ trackingCode });
        if (shipment) {
            res.render('tracking', { shipment });
        } else {
            res.send("No shipment found with this tracking code.");
        }
    } catch (err) {
        console.log(err);
        res.send("An error occurred while tracking. Please try again later.");
    }
});

module.exports = router;
