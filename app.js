// Required libraries
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Shipment = require('./models/Shipment'); // Import the Shipment model

// EJS template engine settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/shipmentDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Error', err));

// Main page - display shipments
app.get('/', async (req, res) => {
    try {
        const shipments = await Shipment.find({});
        res.render('home', { shipments });
    } catch (err) {
        res.status(500).send('Error loading shipments');
    }
});

// Route to add a new shipment
app.post('/add-shipment', async (req, res) => {
    const { trackingCode, status } = req.body;
    try {
        const newShipment = new Shipment({ trackingCode, status });
        await newShipment.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding shipment');
    }
});

// Tracking routes
const trackingRoutes = require('./Routes/trackingRoutes');
app.use('/', trackingRoutes);

// Adding default data if the database is empty
app.listen(3000, async () => {
    console.log('Server is running on http://localhost:3000 🚀');
    try {
        // Check if there are any shipments in the database
        const shipmentsCount = await Shipment.countDocuments();
        if (shipmentsCount === 0) {
            // Adding more realistic default shipment data
            const newShipments = [
                { trackingCode: 'ORD123456', status: 'Shipped' },
                { trackingCode: 'ORD789012', status: 'Delivered' },
                { trackingCode: 'ORD345678', status: 'In Transit' },
                { trackingCode: 'ORD567890', status: 'Pending' },
                { trackingCode: 'ORD678901', status: 'Delivered' },
                { trackingCode: 'ORD234567', status: 'Shipped' },
                { trackingCode: 'ORD890123', status: 'In Transit' },
                { trackingCode: 'ORD456789', status: 'Pending' },
                { trackingCode: 'ORD123789', status: 'Shipped' },
                { trackingCode: 'ORD345123', status: 'In Transit' }
            ];
            await Shipment.insertMany(newShipments);
            console.log('Default shipment data added');
        }
    } catch (err) {
        console.log('Error adding default shipments:', err);
    }
});
