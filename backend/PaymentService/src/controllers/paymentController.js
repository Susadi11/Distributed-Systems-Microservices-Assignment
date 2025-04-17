const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // Create the PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Respond with the client secret
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
};
