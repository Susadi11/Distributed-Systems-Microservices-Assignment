import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', form: '' });

    const { email, password } = formData;

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (!email || !password) {
      setErrors({
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        setErrors({ ...errors, form: 'Invalid admin credentials' });
      }
      setLoading(false);
    }, 1000);
  };

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem('isAdmin') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>

        {errors.form && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {errors.form}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
