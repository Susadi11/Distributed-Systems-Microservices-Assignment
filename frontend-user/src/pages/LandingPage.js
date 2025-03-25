import React from 'react';
import Navbar from '../components/Utility/Navbar';

export default function LandingPage() {
    return (
        <div>
            <Navbar />
            <main className="p-8">
                <h1 className="text-3xl font-bold">Welcome to the Landing Page</h1>
                <p className="mt-4">This is where your content goes...</p>
            </main>
        </div>
    );
}
