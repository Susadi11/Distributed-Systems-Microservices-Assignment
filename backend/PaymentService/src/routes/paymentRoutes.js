const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to handle creating a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Route to get all payment intents
router.get('/payment-intents', paymentController.getAllPaymentIntents);

// Route to get monthly revenue
router.get('/monthly-revenue', paymentController.getMonthlyRevenue);

module.exports = router;
