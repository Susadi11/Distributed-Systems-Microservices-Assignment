// src/components/Privacy.js
import React from 'react';
import { Shield, Lock, Eye, EyeOff, CreditCard } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-6">Privacy & Security</h2>

            <div className="space-y-6">
                <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-3">
                        <Shield className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium">Account Security</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your account security settings and two-factor authentication.
                            </p>
                        </div>
                    </div>
                    <button className="mt-2 text-sm text-red-600 font-medium hover:underline">
                        Update Security Settings
                    </button>
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-3">
                        <Lock className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium">Login Activity</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                View recent login activity and active sessions.
                            </p>
                        </div>
                    </div>
                    <button className="mt-2 text-sm text-red-600 font-medium hover:underline">
                        View Login History
                    </button>
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-3">
                        <Eye className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium">Data Privacy</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Control what data we collect and how we use it.
                            </p>
                        </div>
                    </div>
                    <button className="mt-2 text-sm text-red-600 font-medium hover:underline">
                        Manage Privacy Settings
                    </button>
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-3">
                        <CreditCard className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium">Payment Methods</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                View and manage your saved payment methods.
                            </p>
                        </div>
                    </div>
                    <button className="mt-2 text-sm text-red-600 font-medium hover:underline">
                        Update Payment Methods
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Privacy;