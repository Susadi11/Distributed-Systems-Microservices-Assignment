import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Avoid redirecting if already on login page or public routes
  const isOnLoginPage = location.pathname === '/login' || location.pathname === '/';

  if (!user && !isOnLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
