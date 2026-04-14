# Mini-Etsy: Full-Stack Marketplace Application

A production-ready, modular marketplace web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform allows sellers to create storefronts, list products, and manage orders, while customers can browse, search, purchase items, and track their orders. Admins have full oversight capabilities.

## 🏗️ Tech Stack & Architecture

### Frontend
- **React.js (Vite)**: Fast development build tool
- **React Router v6**: Client-side routing
- **Context API**: State management for Auth and Cart
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Efficient form handling and validation
- **React Toastify**: Toast notifications for user feedback

### Backend
- **Node.js & Express.js**: Server-side runtime and framework
- **RESTful API**: Standardized API architecture
- **MVC Pattern**: Modular folder structure (Models, Views/Controllers, Routes)
- **Mongoose**: MongoDB ODM for schema modeling and validation

### Database
- **MongoDB**: NoSQL database
- **Mongoose Schemas**: Strict typing and validation for data models

### Authentication & Security
- **JWT (JSON Web Tokens)**: Stateless authentication
- **httpOnly Cookies**: Secure token storage
- **bcryptjs**: Password hashing
- **Role-Based Access Control (RBAC)**: `admin`, `seller`, `customer` roles
- **Helmet**: Secure HTTP headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **express-rate-limit**: Brute-force protection
- **express-mongo-sanitize**: NoSQL injection prevention
- **xss-clean**: XSS attack prevention

### File Uploads
- **Multer**: Middleware for handling `multipart/form-data`
- **Cloudinary**: Cloud storage for product images and store banners

---

## 👤 User Roles & Features

### 1. Seller
- **Authentication**: Register and login with JWT.
- **Storefront Management**: Create and update shop name, bio, and banner image.
- **Product Management**: Full CRUD operations on products (title, description, price, category, stock, images).
- **Order Management**: View incoming orders and update status (`Processing` → `Shipped` → `Delivered`).
- **Dashboard**: Protected route for seller-specific analytics and actions.

### 2. Customer
- **Authentication**: Register and login.
- **Browsing**: Search products, filter by category, sort by price/rating.
- **Product Details**: View detailed product pages with images and descriptions.
- **Cart**: Add/remove items, persistent cart via localStorage/DB.
- **Checkout**: Mock payment flow and order placement.
- **Order History**: View personal orders and track real-time status.

### 3. Admin
- **Dashboard**: Secure admin-only interface.
- **User Management**: View, approve, suspend, or delete sellers.
- **Site Oversight**: View all products and orders across the platform.
- **Analytics**: View total users, orders, and revenue statistics.

---

## 🗄️ Data Models

### User
- `name`: String
- `email`: String (unique, indexed)
- `password`: String (hashed)
- `role`: Enum (`admin`, `seller`, `customer`)
- `createdAt`: Date

### Store
- `seller`: Ref(User)
- `shopName`: String
- `bio`: String
- `bannerImage`: String (URL)
- `isApproved`: Boolean

### Product
- `seller`: Ref(User)
- `store`: Ref(Store)
- `title`: String
- `description`: String
- `price`: Number
- `category`: String (indexed)
- `stock`: Number
- `images`: Array[String]
- `ratings`: Array[Ref(User)]
- `createdAt`: Date

### Order
- `customer`: Ref(User)
- `items`: Array[{product, quantity, price}]
- `totalAmount`: Number
- `status`: Enum (`Processing`, `Shipped`, `Delivered`)
- `shippingAddress`: Object
- `createdAt`: Date

### Cart
- `customer`: Ref(User)
- `items`: Array[{product: Ref(Product), quantity: Number}]

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Login user
- `POST /logout`: Logout user (clear cookie)
- `GET /me`: Get current logged-in user

### Stores (`/api/stores`)
- `POST /`: Create a store (Seller)
- `GET /`: Get all stores
- `GET /:id`: Get single store
- `PUT /:id`: Update store (Seller only)
- `PATCH /:id/approve`: Approve store (Admin only)

### Products (`/api/products`)
- `GET /`: Get all products (with search, filter, sort, pagination)
- `GET /:id`: Get single product
- `POST /`: Create product (Seller)
- `PUT /:id`: Update product (Seller, own only)
- `DELETE /:id`: Delete product (Seller/Admin)

### Orders (`/api/orders`)
- `POST /`: Place new order (Customer)
- `GET /my-orders`: Get customer's orders
- `GET /seller-orders`: Get seller's incoming orders
- `GET /`: Get all orders (Admin)
- `PATCH /:id/status`: Update order status (Seller)

### Cart (`/api/cart`)
- `GET /`: Get user cart
- `POST /add`: Add item to cart
- `PUT /update`: Update item quantity
- `DELETE /remove/:productId`: Remove item
- `DELETE /clear`: Clear cart

### Admin (`/api/admin`)
- `GET /users`: Get all users
- `DELETE /users/:id`: Delete user
- `GET /stats`: Get platform statistics

---

## 📁 Project Structure

```
/
├── /client              # React Frontend (Vite)
│   ├── /src
│   │   ├── /components  # Reusable UI components
│   │   ├── /pages       # Route pages (Home, Dashboard, etc.)
│   │   ├── /context     # Auth & Cart Context providers
│   │   ├── /hooks       # Custom hooks (useAuth, useCart)
│   │   ├── /services    # Axios API instances
│   │   ├── /utils       # Helper functions
│   │   └── App.jsx      # Main app component with routes
│   ├── tailwind.config.js
│   └── package.json
│
├── /server              # Express Backend
│   ├── /config          # DB & Cloudinary config
│   ├── /controllers     # Business logic
│   ├── /middleware      # Auth, Error handling, RBAC
│   ├── /models          # Mongoose schemas
│   ├── /routes          # API route definitions
│   ├── /utils           # Helpers (error classes, validators)
│   ├── server.js        # Entry point
│   └── package.json
│
├── .env                 # Environment variables
└── README.md            # This file
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for image uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mini-etsy
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
FRONTEND_URL=http://localhost:5173
```

Run the backend server:
```bash
npm run dev
# Or for production: npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `/client` directory (if needed for specific env vars, though usually Vite handles proxy in `vite.config.js`):
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend development server:
```bash
npm run dev
```

---

## 🔐 Security Features

- **Password Hashing**: All passwords hashed with `bcryptjs` before storage.
- **JWT Authentication**: Tokens stored in `httpOnly` cookies to prevent XSS access.
- **RBAC Middleware**: Routes protected by `protect` and `authorize` middleware.
- **Input Sanitization**: NoSQL injection and XSS prevention via dedicated middleware.
- **Rate Limiting**: Auth endpoints limited to prevent brute-force attacks.
- **CORS**: Restricted to frontend origin only.

---

## 🚀 Key Implementation Details

### Pagination
All list endpoints support pagination via query parameters:
`GET /api/products?page=1&limit=10`

### Error Handling
Consistent JSON error response format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Protected Routes (Frontend)
- Unauthenticated users are redirected to `/login`.
- Unauthorized roles (e.g., non-admin accessing admin dashboard) are redirected to a 403 page.

### Image Uploads
- Uses `Multer` for memory storage and `Cloudinary` stream uploader for cloud storage.
- Supports multiple images per product.

---

## 📝 License
MIT License

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.
