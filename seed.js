const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./backend/models/MenuItem');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Seed data
const menuItems = [
  {
    name: "Masala Dosa",
    price: 120,
    description: "Crispy dosa stuffed with spicy mashed potatoes.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/masala-dosa.jpg"
  },
  {
    name: "Plain Dosa",
    price: 100,
    description: "Traditional South Indian rice crepe served with chutneys.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/plain-dosa.jpg"
  },
  {
    name: "Idli",
    price: 80,
    description: "Steamed rice cakes, light and fluffy, served with sambar and chutney.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/idli.jpg"
  },
  {
    name: "Medu Vada",
    price: 90,
    description: "Crispy fried lentil donuts, perfect with coconut chutney.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/medu-vada.jpg"
  },
  {
    name: "Upma",
    price: 85,
    description: "Savory semolina porridge with vegetables and mustard seeds.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/upma.jpg"
  },
  {
    name: "Pongal",
    price: 90,
    description: "Comforting rice and lentil dish, seasoned with pepper and ghee.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/pongal.jpg"
  },
  {
    name: "Sambar",
    price: 70,
    description: "Spicy and tangy lentil-based vegetable stew.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/sambar.jpg"
  },
  {
    name: "Rasam Rice",
    price: 60,
    description: "Hot and peppery tamarind soup served over rice.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/rasam-rice.jpg"
  },
  {
    name: "Curd Rice",
    price: 70,
    description: "Cool and refreshing yogurt rice with mustard tempering.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/curd-rice.jpg"
  },
  {
    name: "Filter Coffee",
    price: 40,
    description: "Strong and aromatic South Indian filter coffee.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/filter-coffee.jpg"
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing menu items
    await MenuItem.deleteMany({});
    
    // Insert new menu items
    await MenuItem.insertMany(menuItems);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 