const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel'); // import model

const createPaymentIntent = async (req, res) => {
  try {
    const { orderId ,amount, currency = 'usd',paymentMethod, userId } = req.body;

    // 1. Create PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // 2. Save payment info to MongoDB
    const payment = new Payment({
      orderId: orderId || null,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      paymentMethod: paymentMethod || 'card',
      status: paymentIntent.status,
      user: userId || null, 
    });

    await payment.save();

    // 3. Return client secret
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

//get all payment intents
const getAllPaymentIntents = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payment intents:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  getAllPaymentIntents
};
