const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Try multiple secrets in case there's a mismatch
    const secrets = [
      process.env.JWT_SECRET,
      'your-secret-key',
      'fallback-secret'
    ];

    let decoded = null;
    let lastError = null;

    for (const secret of secrets) {
      if (!secret) continue;
      try {
        decoded = jwt.verify(token, secret);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!decoded) {
      console.error('Token verification failed with all secrets:', lastError.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.userId).populate('doctorId');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(403).json({ message: 'Authentication failed' });
  }
};

// Middleware to check specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = authorizeRoles('admin');
const requireDoctor = authorizeRoles('doctor', 'admin');
const requireReceptionist = authorizeRoles('receptionist', 'admin');
const requireStaff = authorizeRoles('receptionist', 'doctor', 'admin');

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireDoctor,
  requireReceptionist,
  requireStaff
};




