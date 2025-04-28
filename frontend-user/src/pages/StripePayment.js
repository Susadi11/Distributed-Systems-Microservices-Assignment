import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const stripePromise = loadStripe("pk_test_51RExwePoRk0cCX50XbOuC3Of8MEJwv7yg75VqbHrF4NFpcPos2n2J53jrCpRXDxPJLHVlXD6j1dfx58pJit03ki300TayrlS9w");

const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#e61a45",
    colorBackground: "#ffffff",
    colorText: "#4a3f55",
    colorDanger: "#df1b41",
    fontFamily: "Inter, sans-serif",
    spacingUnit: "2px",
    borderRadius: "6px",
  },
  rules: {
    ".Input": {
      padding: "12px",
      border: "1px solid #d9d9d9",
      borderRadius: "6px",
      backgroundColor: "#f7f7f7",
    },
    ".Input:focus": {
      borderColor: "#e61a45",
      boxShadow: "0 0 0 1px #e61a45",
    },
    ".Label": {
      fontWeight: "600",
    },
    ".Error": {
      color: "#df1b41",
    },
  },
};

const options = {
  appearance,
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [rememberCard, setRememberCard] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state) {
      setTotal(location.state.total);
      setOrderId(location.state.orderId);
      setUserId(location.state.userId);
      setLoading(false);
    } else {
      navigate('/checkout');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");

    if (!stripe || !elements || !orderId || !userId) {
      setMessage("Payment system not ready. Please try again.");
      setProcessing(false);
      return;
    }

    try {
      // 1. Create payment intent with order details
      const { data } = await axios.post(
          "http://localhost:5552/create-payment-intent",
          {
            orderId,
            amount: Math.round(total * 100),
            currency: "usd",
            paymentMethod: "card",
            userId
          }
      );

      // 2. Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardNumberElement),
            }
          }
      );

      if (error) {
        setMessage(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Update order status
        await axios.patch(`http://localhost:5559/orders/${orderId}/payment-success`, {
          paymentIntentId: paymentIntent.id
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        // Clear cart after successful payment
        await axios.delete('http://localhost:5559/cart/clear', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        setMessage("✅ Payment successful! Redirecting to order confirmation...");

        setTimeout(() => {
          navigate('/pending', {
            state: {
              orderId,
              total
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(error.response?.data?.message || "❌ Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <form
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto p-8 bg-white rounded-md shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complete Your Payment</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold">Order #: {orderId}</p>
              <p className="text-lg font-semibold">Total Amount: LKR {total.toFixed(2)}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="p-3 border border-gray-300 rounded-lg">
                  <CardNumberElement />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                  <div className="p-3 border border-gray-300 rounded-lg">
                    <CardExpiryElement />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <div className="p-3 border border-gray-300 rounded-lg">
                    <CardCvcElement />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                  type="checkbox"
                  id="rememberCard"
                  checked={rememberCard}
                  onChange={() => setRememberCard(!rememberCard)}
                  className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <label htmlFor="rememberCard" className="ml-2 block text-sm text-gray-700">
                Save card for future payments
              </label>
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {processing ? "Processing Payment..." : "Pay LKR " + total.toFixed(2)}
            </button>

            {message && (
                <div className={`mt-4 text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </div>
            )}
          </form>
        </div>
      </div>
  );
};

const StripePayment = () => (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
);

export default StripePayment;