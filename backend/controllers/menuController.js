const { MongoClient, ObjectId } = require('mongodb');
const MenuItem = require('../models/MenuItem');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getAllMenuItems = async (req, res) => {
  let client;
  try {
    console.log('Attempting to fetch menu items...');
    
    // Create a new MongoDB client
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB in controller');

    // Get the collection
    const db = client.db('MadrasMeals');
    const collection = db.collection('menuitems');
    
    // Fetch documents
    const menuItems = await collection.find({}).toArray();
    
    console.log('Menu items fetched:', menuItems);
    res.json(menuItems);
  } catch (error) {
    console.error('Error in getAllMenuItems:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
};

const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    console.log('Creating menu item with data:', req.body);
    
    // Create menu item data from body fields
    const menuItemData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category || 'main course', // Default category if not provided
      isAvailable: req.body.isAvailable === 'true' || req.body.isAvailable === true
    };
    
    // If there's a file uploaded, add the image URL
    if (req.file) {
      console.log('Image uploaded:', req.file);
      menuItemData.image = req.file.path;
    }
    
    console.log('Final menu item data:', menuItemData);
    
    // Create and save the menu item
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    
    console.log('Menu item created:', menuItem);
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    console.log('Updating menu item with ID:', req.params.id);
    console.log('Update data:', req.body);
    console.log('File:', req.file);
    
    // Create an update object with the form fields
    const updateData = {};
    
    // Add text fields if they exist
    if (req.body.name) {
      updateData.name = req.body.name;
      console.log('Setting name to:', req.body.name);
    }
    
    if (req.body.description) {
      updateData.description = req.body.description;
      console.log('Setting description to:', req.body.description);
    }
    
    if (req.body.price) {
      updateData.price = Number(req.body.price);
      console.log('Setting price to:', Number(req.body.price));
    }
    
    if (req.body.category) {
      updateData.category = req.body.category;
      console.log('Setting category to:', req.body.category);
    }
    
    if (req.body.isAvailable !== undefined) {
      updateData.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
      console.log('Setting isAvailable to:', updateData.isAvailable);
    }
    
    // If there's a file uploaded, add the image URL
    if (req.file) {
      console.log('New image uploaded:', req.file);
      updateData.image = req.file.path;
      console.log('Setting image to:', req.file.path);
    }
    
    console.log('Final update data:', updateData);
    
    // Check if we actually have data to update
    if (Object.keys(updateData).length === 0) {
      console.log('No update data provided');
      return res.status(400).json({ error: 'No update data provided' });
    }
    
    // Use Mongoose to update the menu item
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    console.log('Menu item updated successfully:', menuItem);
    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(400).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Process a CSV file to import multiple menu items at once
 */
const importMenuItemsFromCSV = async (req, res) => {
  try {
    console.log('Starting CSV import process');
    
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }
    
    console.log('CSV file received:', req.file);
    
    const results = [];
    const errors = [];
    const filePath = req.file.path;
    
    // Create a promise to process the CSV file
    const processCSV = new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Validate each row
          const item = {
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            category: data.category || 'main course',
            isAvailable: data.isAvailable?.toLowerCase() === 'true' || true,
            image: data.image || 'https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/default-food.jpg'
          };
          
          // Validate required fields and data types
          if (!item.name) {
            errors.push({ row: data, error: 'Name is required' });
            return;
          }
          
          if (!item.description) {
            errors.push({ row: data, error: 'Description is required' });
            return;
          }
          
          if (isNaN(item.price) || item.price <= 0) {
            errors.push({ row: data, error: 'Price must be a positive number' });
            return;
          }
          
          if (!['appetizer', 'main course', 'dessert', 'beverage'].includes(item.category)) {
            errors.push({ row: data, error: 'Category must be one of: appetizer, main course, dessert, beverage' });
            return;
          }
          
          // Add valid item to results
          results.push(item);
        })
        .on('end', () => {
          // Delete the temporary CSV file
          fs.unlinkSync(filePath);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    
    await processCSV;
    
    // If we have validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation errors in CSV file',
        details: errors 
      });
    }
    
    // If no valid items found
    if (results.length === 0) {
      return res.status(400).json({ error: 'No valid menu items found in CSV file' });
    }
    
    // Insert all valid items to the database
    console.log(`Importing ${results.length} menu items...`);
    const insertedItems = await MenuItem.insertMany(results);
    
    res.status(201).json({
      message: `Successfully imported ${insertedItems.length} menu items`,
      items: insertedItems
    });
    
  } catch (error) {
    console.error('Error importing menu items from CSV:', error);
    
    // Return a friendly error message
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate a CSV template file for menu items
 */
const getCSVTemplate = (req, res) => {
  try {
    // Create CSV content with headers and a sample row
    const csvContent = 
      'name,description,price,category,isAvailable,image\n' +
      'Sample Dosa,A delicious south indian dish,150,main course,true,https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/default-food.jpg\n' +
      'Masala Dosa,Crispy dosa with potato filling,180,main course,true,\n' +
      'Filter Coffee,Strong south indian coffee,50,beverage,true,';
    
    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="menu-items-template.csv"');
    
    // Send the CSV content
    res.send(csvContent);
    
  } catch (error) {
    console.error('Error generating CSV template:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  importMenuItemsFromCSV,
  getCSVTemplate
}; 