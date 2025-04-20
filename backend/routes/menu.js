const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItem);
router.post('/', auth, adminAuth, createMenuItem);
router.put('/:id', auth, adminAuth, updateMenuItem);
router.delete('/:id', auth, adminAuth, deleteMenuItem);

module.exports = router; 