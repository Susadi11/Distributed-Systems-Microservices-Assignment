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
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length === 2;
            },
            message: props => `Coordinates must have exactly 2 values (longitude and latitude)`
        }
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
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: props => `Order must have at least one item`
        }
    },
    deliveryAddress: {
        type: deliveryAddressSchema,
        required: true
    },
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
        required: true,
        min: 0
    },
    deliveryFee: {
        type: Number,
        required: true,
        min: 0
    },
    serviceFee: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0
    },
    promotionDiscount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },
    paymentId: {
        type: String,
        required: false
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['confirmed', 'finding-driver', 'preparing', 'picked-up', 'delivered', 'canceled', 'pending', 'payment_pending'],
        default: 'confirmed'
    },
    estimatedDeliveryTime: {
        type: Date,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, {
    timestamps: true
});

// Add a pre-save hook to handle any last-minute validation or data formatting
orderSchema.pre('save', function(next) {
    // If paymentMethod is cash, ensure status is set to confirmed
    if (this.paymentMethod === 'cash' && !this.status) {
        this.status = 'confirmed';
    }

    // If paymentMethod is card, ensure proper payment status
    if (this.paymentMethod === 'card') {
        if (!this.paymentStatus) {
            this.paymentStatus = 'pending';
        }
        if (!this.status) {
            this.status = 'payment_pending';
        }
    }

    next();
});

module.exports = mongoose.model('Order', orderSchema);