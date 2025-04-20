import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Check, Banknote, Plus } from 'lucide-react';

const SelectPayment = () => {
    // Set 'cash' as the default selected option
    const [selectedOption, setSelectedOption] = useState('cash');

    const paymentOptions = [
        { id: 'cash', name: 'Cash', description: 'Pay with cash upon delivery' },
        { id: 'card', name: 'Credit/Debit Card', description: 'Pay with your card' },
        { id: 'add', name: 'Add payment method', description: 'Add a new card or digital wallet' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-md">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 rounded-full hover:bg-gray-100 mr-2"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Payment options</h1>
                </div>

                {/* Payment Methods List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {paymentOptions.map((option) => (
                        <div
                            key={option.id}
                            // Apply subtle background if selected
                            className={`border-b border-gray-200 last:border-b-0 ${selectedOption === option.id ? 'bg-red-50' : ''}`}
                        >
                            <button
                                onClick={() => {
                                    if (option.id === 'add') {
                                        console.log('Navigate to Add new payment method screen');
                                    } else {
                                        setSelectedOption(option.id);
                                        console.log(`Selected payment: ${option.id}`);
                                    }
                                }}
                                className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center">
                                    {/* Conditional Icon Rendering */}
                                    {option.id === 'cash' ? (
                                        <Banknote className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                    ) : option.id === 'card' ? (
                                        <CreditCard className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                                    ) : option.id === 'add' ? (
                                        <Plus className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                                    ) : (
                                        <div className="w-5 h-5 mr-3 flex-shrink-0"></div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-800">{option.name}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                </div>
                                {/* Selected Indicator */}
                                {selectedOption === option.id && option.id !== 'add' && ( // Don't show checkmark for 'add' option
                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Save Button - Only show if a *valid* payment option (not 'add') is selected */}
                {selectedOption && selectedOption !== 'add' && (
                    <button
                        onClick={() => {
                            // Navigate back or confirm selection
                            console.log(`Saving selected payment: ${selectedOption}`);

                            alert(`Payment method ${selectedOption} selected!`);
                        }}
                        className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                    >
                        Confirm Payment Method
                    </button>
                )}
            </div>
        </div>
    );
};

export default SelectPayment;