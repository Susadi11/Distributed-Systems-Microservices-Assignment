const mongoose = require('mongoose');

// If you want to store payment data
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: if you have a User model
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
