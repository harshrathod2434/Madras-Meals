require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const adminEmail = 'admin@madrasmeals.com';
const newPassword = 'adminPassword123';

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.error('Admin user not found. Please run createAdmin.js first.');
      return;
    }
    
    console.log('Found admin user:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    
    // Hash the new password using bcrypt directly (same as in comparePassword)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the admin password
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('Admin password reset successfully!');
    console.log('You can now login with:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${newPassword}`);
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetAdminPassword(); 