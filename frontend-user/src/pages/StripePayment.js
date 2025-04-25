import React, { useState } from "react";
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
import Footer from "../components/Utility/Footer";
import Navbar from "../components/Utility/Navbar";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51RExwePoRk0cCX50XbOuC3Of8MEJwv7yg75VqbHrF4NFpcPos2n2J53jrCpRXDxPJLHVlXD6j1dfx58pJit03ki300TayrlS9w"
);

// Define the appearance object for styling
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "http://localhost:5552/create-payment-intent",
        {
          amount: 5000,
        }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful!");
      }
    } catch (error) {
      setMessage("❌ Payment failed. Please try again.");
    }

    setProcessing(false);
  };

  return (
    <>
      <Navbar /> {/* <-- Insert the header here */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8  bg-white rounded-md space-y-8 flex flex-col md:flex-row"
      >
        <div className="relative flex-1 shadow-lg bg-[#e6ebf7] p-10 flex items-center justify-center overflow-hidden ">
          <img
            alt="Red gradient credit card angled with shadow"
            className="w-[300px] h-[300px] object-contain drop-shadow-lg"
            height="190"
            src="https://storage.googleapis.com/a1aa/image/cc53fdf9-63d1-4e14-2d4a-01129ebbcb40.jpg"
            width="full"
          />
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#f7b6b6] to-[#f7b6b6]/0 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-gradient-to-tr from-[#f7b6b6] to-[#f7b6b6]/0 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        </div>

        <div className="flex-1 p-10 shadow-lg bg-white  space-y-8">
          <h2 className="text-2xl font-semibold text-[#4a3f55] mb-6">
            Your payment details
          </h2>

          <div className="p-5 bg-[#e6ebf7] rounded-xl space-y-6 border border-[#d9d9d9]">
            <div>
              <label
                className="block text-xs text-[#4a3f55] mb-1 font-normal"
                htmlFor="cardNumber"
              >
                Card Number
              </label>
              <div className="p-3 bg-white border border-[#d9d9d9] rounded-lg">
                <CardNumberElement />
              </div>
            </div>

            <div>
              <label
                className="block text-xs text-[#4a3f55] mb-1 font-normal"
                htmlFor="cardExpiry"
              >
                Expiry Date
              </label>
              <div className="p-3 bg-white border border-[#d9d9d9] rounded-lg">
                <CardExpiryElement />
              </div>
            </div>

            <div>
              <label
                className="block text-xs text-[#4a3f55] mb-1 font-normal"
                htmlFor="cardCvc"
              >
                CVC
              </label>
              <div className="p-3 bg-white border border-[#d9d9d9] rounded-lg">
                <CardCvcElement />
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs text-[#4a3f55] font-normal mb-6">
            <input
              className="mr-2"
              type="checkbox"
              id="remember"
              checked={rememberCard}
              onChange={() => setRememberCard(!rememberCard)}
            />
            <label className="select-none" htmlFor="remember">
              Remember my card info
            </label>
          </div>

          <button
            type="submit"
            disabled={!stripe || processing}
            className="w-full py-3 px-6 text-white font-semibold bg-[#e61a45] hover:bg-[#cc173d] rounded-md transition duration-300 disabled:opacity-50"
          >
            {processing ? "Processing..." : "PURCHASE"}
          </button>

          {message && (
            <div className="text-center text-sm text-gray-800 mt-3">
              {message}
            </div>
          )}
        </div>
      </form>
    </>
  );
};

const StripePayment = () => (
  <>
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
    <Footer /> {/* <-- Insert the footer here */}
  </>
);

export default StripePayment;
