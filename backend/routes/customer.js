const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerOrders, getCustomerStats } = require('../controllers/customerController');
const { auth, adminAuth } = require('../middleware/auth');

// Middleware to debug authentication issues
router.use((req, res, next) => {
  console.log('Customer route accessed:', req.method, req.url);
  console.log('Auth header:', req.headers.authorization ? 'Present' : 'Missing');
  next();
});

// All routes require admin authentication
router.use(auth, adminAuth);

// Get all customers
router.get('/', async (req, res) => {
  console.log('GET /customers route handler called');
  try {
    await getAllCustomers(req, res);
  } catch (error) {
    console.error('Error in GET /customers:', error);
    res.status(500).json({ error: 'Internal server error in customer route' });
  }
});

// Get orders for a specific customer
router.get('/:customerId/orders', async (req, res) => {
  console.log(`GET /customers/${req.params.customerId}/orders route handler called`);
  try {
    await getCustomerOrders(req, res);
  } catch (error) {
    console.error(`Error in GET /customers/${req.params.customerId}/orders:`, error);
    res.status(500).json({ error: 'Internal server error in customer orders route' });
  }
});

// Get customer statistics
router.get('/stats', async (req, res) => {
  console.log('GET /customers/stats route handler called');
  try {
    await getCustomerStats(req, res);
  } catch (error) {
    console.error('Error in GET /customers/stats:', error);
    res.status(500).json({ error: 'Internal server error in customer stats route' });
  }
});

module.exports = router; 