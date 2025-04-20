const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  importMenuItemsFromCSV,
  getCSVTemplate
} = require('../controllers/menuController');
const { auth, adminAuth } = require('../middleware/auth');
const { upload, csvUpload } = require('../middleware/upload');

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItem);
router.post('/', auth, adminAuth, upload.single('image'), createMenuItem);
router.put('/:id', auth, adminAuth, upload.single('image'), updateMenuItem);
router.delete('/:id', auth, adminAuth, deleteMenuItem);

router.post('/import-csv', auth, adminAuth, csvUpload.single('csv'), importMenuItemsFromCSV);
router.get('/csv-template', getCSVTemplate);

module.exports = router; 