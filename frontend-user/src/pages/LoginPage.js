import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/login.jpeg';

export function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5555/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Save token and user data (note the updated structure to match backend)
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Remember email if checked
            if (formData.rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            navigate('/');

        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData(prev => ({
                ...prev,
                email: rememberedEmail,
                rememberMe: true
            }));
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <div className="md:w-1/2 relative">
                <img
                    src={loginImage}
                    alt="Login illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Login</h2>
                        <p className="text-gray-500">Enter your credentials</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-700 focus:outline-none bg-transparent transition-colors"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-sm text-red-700 hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-700 focus:outline-none bg-transparent transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-red-700 focus:ring-red-700"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.033s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.139-2.701-6.735-2.701-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10-7.584 10-10 0-0.665-0.065-1.369-0.173-2.003h-9.803z" fill="#EA4335"/>
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686 0.235 2.686 0.235v2.953h-1.514c-1.491 0-1.956 0.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385c5.737-0.9 10.125-5.864 10.125-11.854z" fill="#1877F2"/>
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Facebook</span>
                            </button>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-medium text-red-700 hover:underline">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}