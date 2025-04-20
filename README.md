# Madras Meals

A full-stack web application for a food delivery service with separate admin and customer frontends.

## Project Structure

- **backend/** - Node.js/Express REST API
- **admin-frontend/** - React admin dashboard for managing menu items and orders
- **customer-frontend/** - React customer-facing website for ordering food

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **Frontend**: React, Bootstrap, React Router, Context API
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=2000
   MONGODB_URI=mongodb://localhost:27017/MadrasMeals
   JWT_SECRET=your-secret-key
   ```

4. Start the backend server:
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

3. Start the admin frontend:
   ```bash
   npm start
   ```

4. The admin frontend will be running at http://localhost:3001

### Customer Frontend Setup

1. Navigate to the customer frontend directory:
   ```bash
   cd customer-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the customer frontend:
   ```bash
   npm start
   ```

4. The customer frontend will be running at http://localhost:3000

## Features

### Customer Portal
- Browse menu items
- Add items to cart
- Place orders
- View order history and status
- User registration and authentication

### Admin Portal
- Manage menu items (create, update, delete)
- View and manage orders
- Update order status
- Admin-only authentication

## Admin Login Credentials

- Email: admin@madrasmeals.com
- Password: adminPassword123

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user profile

### Menu
- GET /api/menu - Get all menu items
- GET /api/menu/:id - Get specific menu item
- POST /api/menu - Create menu item (admin only)
- PUT /api/menu/:id - Update menu item (admin only)
- DELETE /api/menu/:id - Delete menu item (admin only)

### Orders
- POST /api/orders - Create a new order
- GET /api/orders - Get user's orders
- GET /api/orders/:id - Get specific order
- GET /api/orders/admin/all - Get all orders (admin only)
- PUT /api/orders/:id/status - Update order status (admin only)

### Profile
- PUT /api/profile - Update user profile 