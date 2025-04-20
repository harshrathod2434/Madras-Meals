# MadrasMeals Restaurant Ordering System

A full-stack restaurant ordering website with separate customer and admin interfaces.

## Tech Stack

- **Frontend (Customer site)**: React with JavaScript, Bootstrap
- **Frontend (Admin site)**: React with JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Image Hosting**: Cloudinary

## Project Structure

```
madras-meals/
├── backend/              # Backend code
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   └── routes/           # API routes
├── customer-frontend/    # Customer-facing React app
├── admin-frontend/       # Admin-facing React app
├── server.js            # Main server file
├── seed.js              # Database seeding script
└── package.json         # Backend dependencies
```

## Setup Instructions

### Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MONGO_URI=your_mongodb_uri
   ```

3. Seed the database with initial menu items:
   ```bash
   npm run seed
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Customer Frontend Setup

1. Navigate to the customer frontend directory:
   ```bash
   cd customer-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Admin Frontend Setup

1. Navigate to the admin frontend directory:
   ```bash
   cd admin-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Running the Application

1. Start the backend server (port 9000)
2. Start the customer frontend (port 9001)
3. Start the admin frontend (port 9002)

## Features

### Customer Website
- Browse menu items
- Add items to cart
- Place orders
- View order history
- User authentication

### Admin Dashboard
- Manage menu items
- View and update orders
- Import menu items via CSV
- Admin authentication

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Menu Items
- GET /api/menu - Get all menu items
- GET /api/menu/:id - Get a specific menu item
- POST /api/menu - Create a new menu item (admin only)
- PUT /api/menu/:id - Update a menu item (admin only)
- DELETE /api/menu/:id - Delete a menu item (admin only)
- POST /api/menu/import - Import menu items from CSV (admin only)

### Orders
- POST /api/orders - Create a new order
- GET /api/orders/my-orders - Get user's orders
- GET /api/orders - Get all orders (admin only)
- PUT /api/orders/:id/status - Update order status (admin only)
- PUT /api/orders/:id/items - Update order items (admin only) 