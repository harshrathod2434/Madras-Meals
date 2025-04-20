const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware triggered');
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found:', authHeader);
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted, attempting to verify');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, user ID:', decoded.userId);
      
      const user = await User.findOne({ _id: decoded.userId });
      if (!user) {
        console.log('User not found with ID:', decoded.userId);
        return res.status(401).json({ error: 'User not found' });
      }
      
      console.log('User authenticated:', user.name, 'Role:', user.role);
      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const adminAuth = (req, res, next) => {
  try {
    console.log('Admin auth middleware triggered for user:', req.user?.name);
    if (!req.user) {
      console.log('No user found in request - auth middleware not called first?');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (req.user.role !== 'admin') {
      console.log('User is not admin. Role:', req.user.role);
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    console.log('Admin access granted for:', req.user.name);
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ error: 'Error in admin authorization' });
  }
};

module.exports = { auth, adminAuth }; 