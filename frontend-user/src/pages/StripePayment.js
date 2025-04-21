import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements,
    Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RExwePoRk0cCX50XbOuC3Of8MEJwv7yg75VqbHrF4NFpcPos2n2J53jrCpRXDxPJLHVlXD6j1dfx58pJit03ki300TayrlS9w'); // Replace with your key

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProcessing(true);
        setMessage('');

        try {
            const { data } = await axios.post('http://localhost:5555/create-payment-intent', {
                amount: 5000, // $50.00
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setMessage(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                setMessage('✅ Payment successful!');
            }
        } catch (error) {
            setMessage('❌ Payment failed. Please try again.');
        }

        setProcessing(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-700">Enter Payment Details</h2>

            <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#32325d',
                                '::placeholder': {
                                    color: '#a0aec0',
                                },
                            },
                            invalid: {
                                color: '#e53e3e',
                            },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
                {processing ? 'Processing...' : 'Pay $50.00'}
            </button>

            {message && (
                <div className="text-center text-sm text-gray-700 mt-2">{message}</div>
            )}
        </form>
    );
};

const StripePayment = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default StripePayment;
