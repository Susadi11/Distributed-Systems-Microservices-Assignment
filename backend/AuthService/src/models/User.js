const mongoose = require("mongoose");
const DeliveryPersonnelDetailsSchema = require("./DeliveryPersonnelDetails");

// Then use it in your main schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String, 
        enum: ["customer", "resturant_admin", "delivery_personnel", "admin"],
        default: "customer"
    },
    deliveryPersonnelDetails: {
        type: DeliveryPersonnelDetailsSchema,
        required: function() { return this.role === "delivery_personnel"; }
    },
}, {timestamps: true});

// Your validation can remain the same
UserSchema.pre('validate', function(next) {
    if (this.role === "delivery_personnel") {
        if (!this.deliveryPersonnelDetails || !this.deliveryPersonnelDetails.vehicleType) {
            this.invalidate('deliveryPersonnelDetails', 'Delivery personnel details are required');
        }
    }
    next();
});

module.exports = mongoose.model("User", UserSchema);
