# 🛍️ Shopperod - Full Stack E-commerce Application

Shopperod is a comprehensive e-commerce platform built with modern technologies. It features robust authentication, product management, order processing, and inventory management capabilities.

![Shopperod E-commerce Platform](https://via.placeholder.com/800x400?text=Shopperod+E-commerce+Platform)

## ✨ Key Features

### 👥 User Management
- ✅ User registration with email & password via Supabase Auth
- 🔒 Role-based access control (User/Admin separation)
- 🔑 Secure authentication with HTTP-only cookies
- 👤 Profile management with custom fields (first name, last name, phone, gender)
- 🚪 Secure session handling and auto-fetch user information

### 📦 Product Management
- ✅ Complete CRUD operations for products
- 🖼️ Image upload to Supabase Storage
- 📊 Inventory tracking with stock management
- 🔍 Product search and filtering

### 🛒 Shopping Features
- 🛒 Shopping cart functionality
- ➕ Add/remove products from cart
- 🔢 Update product quantities
- 💲 Order placement and processing

### 📋 Order Management
- 📝 Order history for users
- 🚚 Order status tracking (Pending, For Delivery, Shipped, Delivered)
- 📊 Admin order dashboard
- 🔄 Order status updates

### 📱 User Interface
- 💅 Clean, responsive design using TailwindCSS
- 🌙 Beautiful component styling with DaisyUI
- ⚡ Fast performance with React and Vite
- 📱 Mobile-friendly interface

## 🛠️ Technology Stack

### Frontend
- **React** - UI component library
- **Vite** - Build tool and development server
- **Zustand** - State management
- **Axios** - HTTP client for API requests
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - UI component library for TailwindCSS
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

### Backend
- **Express.js** - Web server framework
- **Supabase JS Client** - Database and auth client
- **Cookie-parser** - HTTP cookie handling
- **CORS** - Cross-origin resource sharing

### Database & Storage
- **Supabase (PostgreSQL)** - Database with auth and Row Level Security
- **Supabase Storage** - File storage for product images

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/perod122/supabase_CRUD.git
   cd supabase_CRUD
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```
   PORT=5001
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Frontend (.env)**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 📊 Database Structure

### Tables
- **auth.users** - Supabase Auth users
- **profiles** - Extended user information
- **Products** - Product information with inventory
- **cart** - Shopping cart items
- **orders** - Order information
- **order_items** - Items within orders

## 🔒 Security Features
- HTTP-only cookies for session management
- Row Level Security in Supabase
- Server-side validation
- Stock verification before order placement

## 🧪 Future Improvements
- Payment gateway integration
- User reviews and ratings
- Advanced search and filtering
- Admin analytics dashboard
- Email notifications

## 👨‍💻 Author
Made with 💙 by [Perod122](https://github.com/perod122)

## 📃 License
This project is licensed under the [MIT License](https://opensource.org/license/mit).
