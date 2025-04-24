const mongoose = require('mongoose');

//تعريف schema للشحنه
const shipmentSchema = new mongoose.Schema({
    trackingCode: {type:String,required:true,unique:true},
    status:{type:String,required:true},
    lastUpdate:{type:Date,default:Date.now}
});

//انشاء الموديل 
const Shipment = mongoose.model('Shipment',shipmentSchema);

module.exports = Shipment;
