const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type:String , 
        required : true
    },
    email: {
        type:String , 
        required : true
    },
    password: {
        type:String , 
        required : true
    },
    longitude: {
        type: Number,
        required: false,
    },
    latitude: {
        type: Number,
        required: false,
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
        type:String, 
        enum: ["customer", "resturant_admin","delivery_personnel","admin"],
        default:"customer"
    },
    }, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);