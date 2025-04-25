const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  discount: { type: Boolean, default: false },
  images: [{ 
    type: String,
    validate: {
      validator: function(v) {
        return /^(\/uploads\/.+|https?:\/\/.+)/.test(v);
      },
      message: props => `${props.value} is not a valid image path!`
    }
  }],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);