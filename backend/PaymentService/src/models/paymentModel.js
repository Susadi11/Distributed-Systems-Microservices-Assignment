const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },  
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card'], required: true },
  status: { type: String, default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
