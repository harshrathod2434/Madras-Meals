const User = require('../models/User');
const jwt = require('jsonwebtoken');
const connect = require('../config/mongoconnect');

const register = async (req, res) => {
  try {
    console.log('Starting registration process...');
    const { name, email, password } = req.body;
    console.log('Registration data:', { name, email });

    // Ensure database connection first
    await connect();
    console.log('Database connection established');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    console.log('Existing user check result:', existingUser);

    if (existingUser) {
      console.log('Registration failed: Email already exists');
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    console.log('Creating new user...');
    const user = new User({ name, email, password });
    await user.save();
    console.log('User saved successfully:', {
      userId: user._id,
      name: user.name,
      role: user.role
    });

    // Generate token
    console.log('Generating JWT token...');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log('Registration successful:', {
      userId: user._id,
      name: user.name,
      role: user.role,
      tokenGenerated: !!token
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log('==== LOGIN PROCESS START ====');
    console.log('Request body:', req.body);
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Password received (length):', password ? password.length : 0);

    // Ensure database connection first
    await connect();
    console.log('Database connection established');

    // Find user
    console.log('Finding user...');
    const user = await User.findOne({ email });
    console.log('User found:', user ? {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordLength: user.password ? user.password.length : 0
    } : 'No user found');

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    console.log('Checking password...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    console.log('Generating JWT token...');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log('Login successful:', {
      userId: user._id,
      name: user.name,
      role: user.role,
      tokenGenerated: !!token
    });
    console.log('==== LOGIN PROCESS END ====');

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('==== LOGIN ERROR ====');
    console.error('Login error details:', error);
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    console.log('Database connection established');

    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
}; 