// src/components/HelpCenter.js
import React from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, AlertTriangle } from 'lucide-react';

const HelpCenter = () => {
    const faqs = [
        {
            question: 'How do I track my order?',
            answer: 'You can track your order in real-time from the Orders section in your account.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept credit/debit cards, PayPal, and cash on delivery.'
        },
        {
            question: 'How can I cancel my order?',
            answer: 'You can cancel your order within 5 minutes of placing it from the Orders section.'
        }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-6">Help Center</h2>

            <div className="space-y-6">
                <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <details key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                                <summary className="font-medium cursor-pointer flex justify-between items-center">
                                    <span>{faq.question}</span>
                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                </summary>
                                <p className="text-sm text-gray-600 mt-2 pl-2">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Contact Support</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <MessageSquare className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                            <div>
                                <h4 className="font-medium">Live Chat</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Chat with our support team in real-time.
                                </p>
                                <button className="mt-2 text-sm text-red-600 font-medium hover:underline">
                                    Start Chat
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Phone className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                            <div>
                                <h4 className="font-medium">Phone Support</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Call us at +94 11 234 5678 (9AM - 9PM)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Mail className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                            <div>
                                <h4 className="font-medium">Email Us</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    support@fooddelivery.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium">Report an Issue</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                If you're experiencing any issues with our service, please let us know.
                            </p>
                            <button className="mt-2 text-sm text-red-600 font-medium hover:underline">
                                Report Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;