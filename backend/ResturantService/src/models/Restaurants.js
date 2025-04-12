const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    imageUrl: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    addOns: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
});

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    cuisineType: {
        type: String,
        required: true
    },
    openingHours: { type: String },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true }, // For overall restaurant availability
    menu: [FoodItemSchema],
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", RestaurantSchema);