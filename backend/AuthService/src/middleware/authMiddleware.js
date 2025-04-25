const jwt = require('jsonwebtoken');

// Base authentication middleware
const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      // Role check if allowedRoles specified
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// Named middleware versions
authMiddleware.authenticate = (req, res, next) => {
  return authMiddleware()(req, res, next); // No role restriction
};

authMiddleware.authorize = (allowedRoles) => {
  return authMiddleware(allowedRoles); // With role restriction
};

authMiddleware.verifyRestaurantAdmin = (req, res, next) => {
  authMiddleware(['restaurant_admin'])(req, res, (err) => {
    if (err) return next(err);
    
    if (!req.user.restaurantId) {
      return res.status(403).json({ error: 'Restaurant association required' });
    }
    
    next();
  });
};

module.exports = authMiddleware;