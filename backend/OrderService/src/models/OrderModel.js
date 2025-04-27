const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, { _id: false });

const deliveryAddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    deliveryAddress: deliveryAddressSchema,
    deliveryOption: {
        type: String,
        enum: ['door', 'lobby'],
        default: 'door'
    },
    deliveryInstructions: String,
    phoneNumber: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    serviceFee: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    promotionDiscount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },
    paymentId: {  // Add this new field
        type: String,
        required: function() { return this.paymentMethod === 'card'; }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['confirmed', 'finding-driver', 'preparing', 'picked-up', 'delivered','canceled'],
        default: 'confirmed'
    },
    estimatedDeliveryTime: {
        type: Date,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Order', orderSchema);