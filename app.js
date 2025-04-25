const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Shipment = require('./models/Shipment'); // Import the Shipment model
const userRoutes = require('./Routes/userRoutes');
const trackingRoutes = require('./Routes/trackingRoutes');

// Middleware to parse JSON requests
app.use(express.json());
app.use('/', userRoutes); // User routes
app.use('/api', trackingRoutes);  // Tracking routes

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shipmentDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Error', err));

// Main page - API route to get all shipments
app.get('/api/shipments', async (req, res) => {
    try {
        const shipments = await Shipment.find({});
        res.json({ shipments });  // Send data as JSON
    } catch (err) {
        res.status(500).json({ error: 'Error loading shipments' });
    }
});

// Route to add a new shipment
app.post('/api/shipments', async (req, res) => {
    const { trackingCode, status } = req.body;

    // Validate input
    if (!trackingCode || !status) {
        return res.status(400).json({ error: 'Tracking code and status are required' });
    }

    try {
        const newShipment = new Shipment({ trackingCode, status });
        await newShipment.save();
        res.status(201).json({ message: 'Shipment added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding shipment' });
    }
});

// Adding default data if the database is empty
app.listen(3000, async () => {
    console.log('Server is running on http://localhost:3000 🚀');
    try {
        const shipmentsCount = await Shipment.countDocuments();
        if (shipmentsCount === 0) {
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

// Global error handler (for unhandled routes and errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
