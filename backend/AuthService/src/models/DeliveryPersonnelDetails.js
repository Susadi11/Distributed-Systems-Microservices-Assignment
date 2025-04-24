const mongoose = require("mongoose");

const DeliveryPersonnelDetailsSchema = new mongoose.Schema({
    vehicleType: { 
        type: String, 
        required: true 
    },
    vehicleNumber: { 
        type: String, 
        required: true 
    },
    Make: {
        type: String, 
        required: true 
    },
    Model: {
        type: String, 
        required: true 
    },
    year: {
        type: Number, 
        required: true 
    },
    DriverLicense: {
        type: String, 
        required: true 
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
});

module.exports = DeliveryPersonnelDetailsSchema;
