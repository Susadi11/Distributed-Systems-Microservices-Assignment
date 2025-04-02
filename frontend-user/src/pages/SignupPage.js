import React from 'react';
import signupImage from '../images/signup.jpeg'; // Make sure to have a signup image in your images folder

export function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left side - full height image */}
            <div className="md:w-1/2 relative">
                <img
                    src={signupImage}
                    alt="Signup illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Right side with signup form */}
            <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500">Join us to get started</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border-b border-gray-300 focus:border-dark-red focus:outline-none bg-transparent transition-colors"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border-b border-gray-300 focus:border-dark-red focus:outline-none bg-transparent transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border-b border-gray-300 focus:border-dark-red focus:outline-none bg-transparent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border-b border-gray-300 focus:border-dark-red focus:outline-none bg-transparent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-dark-red focus:ring-dark-red"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the <a href="#" className="text-dark-red hover:underline">Terms</a> and <a href="#" className="text-dark-red hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-dark-red text-white py-3 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    className="h-5"
                                />
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <img
                                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                                    alt="Facebook"
                                    className="h-5"
                                />
                                <span className="text-sm font-medium text-gray-700">Facebook</span>
                            </button>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <a href="#" className="font-medium text-dark-red hover:underline">
                                Log in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}