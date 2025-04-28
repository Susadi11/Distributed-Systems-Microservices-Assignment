const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel'); 
const moment = require('moment');
const Transaction = require('../models/paymentModel'); 
const mongoose = require('mongoose'); 

const createPaymentIntent = async (req, res) => {
  try {
    const { orderId ,amount, currency = 'lkr',paymentMethod, userId } = req.body;

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
    
   
    const fetchPaymentIntent = async (paymentIntentId, retries = 3, delay = 1000) => {
      try {
        return await stripe.paymentIntents.retrieve(paymentIntentId);
      } catch (err) {
        if (err.type === 'StripeRateLimitError' && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchPaymentIntent(paymentIntentId, retries - 1, delay * 2);
        }
        throw err;
      }
    };

    // Process payments in batches to avoid rate limits
    const batchSize = 5; 
    const paymentsWithCurrentStatus = [];
    
    for (let i = 0; i < payments.length; i += batchSize) {
      const batch = payments.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (payment) => {
          try {
            const paymentIntent = await fetchPaymentIntent(payment.paymentIntentId);
            
  
            if (payment.status !== paymentIntent.status) {
              payment.status = paymentIntent.status;
              await payment.save();
            }
            
            return payment;
          } catch (err) {
            console.error(`Error processing payment ${payment._id}:`, err.message);
            return payment; 
          }
        })
      );
      
      paymentsWithCurrentStatus.push(...batchResults);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
    
    res.status(200).json(paymentsWithCurrentStatus);
  } catch (error) {
    console.error('Error fetching payment intents:', error);
    res.status(500).json({ error: error.message });
  }
};
// GET /api/transactions/monthly-revenue
const getMonthlyRevenue = async (req, res) => {
  try {
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    const revenueData = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          // status removed to count all transactions
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Convert month number to name and fill missing months
    const months = moment.months(); // ["January", "February", ...]
    const result = Array.from({ length: 12 }, (_, i) => {
      const match = revenueData.find(item => item._id === i + 1);
      return {
        month: months[i].slice(0, 3), // "Jan", "Feb", ...
        revenue: match ? match.totalRevenue : 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get total transaction amount
const getTotalTransactionAmount = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const total = result.length > 0 ? result[0].totalAmount : 0;

    res.status(200).json({ total });
  } catch (error) {
    console.error("Error calculating total transaction amount:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  createPaymentIntent,
  getAllPaymentIntents,
  getMonthlyRevenue,
  getTotalTransactionAmount,
};
