import React from 'react';

export function SignupPage() {
    return (
        <section className="bg-white min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="border rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Create Your Account
                </h2>

                <form action="#">
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-dark-red outline-none"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-dark-red outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-dark-red outline-none"
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-dark-red outline-none"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-dark-red text-white py-3 rounded-lg hover:bg-red-hover focus:outline-none focus:ring focus:ring-red-200"
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-center mt-6 text-gray-600">
                        Already have an account?
                        <a href="#" className="text-dark-red hover:underline">
                            Login
                        </a>
                    </p>
                </form>

                <div className="flex items-center my-8">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">Or</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 border py-3 rounded-3xl mb-4 hover:bg-gray-50">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGFKGkE0n-MIDhhhVId5GpfwSz5wcPvTJ_Zw&s"
                        alt="Facebook"
                        className="h-5"
                    />
                    Continue with Facebook
                </button>

                <button className="w-full flex items-center justify-center gap-2 border py-3 rounded-3xl hover:bg-gray-50">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG5FqrS9OkN5XrA5_GXcN7OV-SoLIl0KPwoQ&s"
                        alt="Google"
                        className="h-5"
                    />
                    Continue with Google
                </button>
            </div>
        </section>
    );
}