const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const restaurantSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  brandName: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['Restaurant', 'Cafe', 'Bakery', 'Food Truck', 'Grocery Store', 'Other Food Business']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    floorSuite: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    },
    country: {
      type: String,
      default: 'Sri Lanka'
    }
  },
  contact: {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    phone: {
      countryCode: {
        type: String,
        default: '+94'
      },
      number: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
          validator: function(v) {
            return /\d{9,15}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        }
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept the terms and conditions'],
    validate: {
      validator: function(v) {
        return v === true;
      },
      message: 'You must accept the terms and conditions'
    }
  },
  description: {
    type: String,
    trim: true
  },
  profileImage: [{
    type: String,
    validate: {
      validator: function(v) {
        // Validate URL format (either local path, full URL, or Base64 string)
        return /^(\/uploads\/.+|https?:\/\/.+|data:image\/.+;base64,.+)/.test(v);
      },
      message: props => `${props.value} is not a valid image path or Base64 string!`
    }
  }],
  openingHours: {
    open: {
      type: String,
      default: '09:00'
    },
    close: {
      type: String,
      default: '22:00'
    }
  },
  isOpenNow: {
    type: Boolean,
    default: false
  },
  cuisineTypes: [{
    type: String,
    trim: true
  }],
  
 
}, { timestamps: true });


restaurantSchema.index({
  'storeName': 'text',
  'brandName': 'text',
  'address.city': 'text',
  'address.state': 'text'
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;