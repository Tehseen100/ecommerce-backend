# E-Commerce Backend

A production-ready, highly secure, and modular e-commerce backend built with Node.js, Express, and MongoDB. This system features a decoupled layered architecture (Controller-Service-Repository flow), strict request schema validation, automated cloud asset rollback triggers, and highly secure JWT session management.

## 🚀 Key Architectural Features

- **Layered Architecture:** Strict separation of concerns across Routes, Middlewares, Validators, Controllers, Services, and Mongoose Models to ensure modularity and seamless automated testing.
- **Fail-Safe Asset Pipeline (Zero-Leak Storage):** Dual-layer transactional file storage utilizing Multer and Cloudinary. If validation fails or a database operation crashes, a custom rollback mechanism instantly purges temporary files from both the local disk and the cloud storage dashboard to prevent orphaned data.
- **Dual-Token Security Strategy:** Session security implemented using short-lived Access Tokens (passed via JSON memory) and long-lived Refresh Tokens securely baked into `httpOnly` cookies, completely shielding the application from Cross-Site Scripting (XSS) token extraction.
- **Failsafe Boot Configuration:** Runtime environment verification powered by Zod. The server checks, sanitizes, and typecasts all `.env` configuration requirements immediately upon boot, preventing silent mid-execution failures.
- **State Integrity Inventory Guard:** Persistent database-synchronized shopping carts that dynamically check Mongoose inventory levels at insertion, flowing into an immutable Checkout tracking system that captures transaction-moment price snapshots.

---

## 📂 Project Structure

```text
📁 ecommerce-backend
├── 📁 public
│   └── 📁 temp            # Temporary landing area for Multer file streams
├── 📁 src
│   ├── 📁 app.js          # Express initialization, global configurations, and middleware mounting
│   ├── 📁 config          # DB initializers, Cloudinary configs, and Zod env parsers
│   ├── 📁 controllers     # HTTP Request/Response managers (decapsulates req data)
│   ├── 📁 middlewares     # Authentication guards, admin role locks, and local file purgers
│   ├── 📁 models          # Mongoose Schemas & automated pre-save hooks (hashers/slugifiers)
│   ├── 📁 routes          # Express router endpoint definitions
│   ├── 📁 services        # Pure business logic and database queries (isolated from HTTP layer)
│   ├── 📁 utils           # Global error wrappers, unified response objects, and async handlers
│   └── 📁 validators      # Zod request validation payload schemas
├── .env.example
├── .gitignore
├── package.json
└── server.js              # Hardware/Environment entry point (boots server & database)
```

---

## 🛠️ Tech Stack & Dependencies

- **Runtime:** Node.js (ES Modules syntax enabled)
- **Framework:** Express v5.x (Next-generation asynchronous routing)
- **Database:** MongoDB & Mongoose v9.x (ODM with strict schemas and index optimizations)
- **Validation:** Zod v4.x (Runtime environment & payload validation)
- **Security:** JSON Web Tokens (JWT) & Bcrypt (Password hashing & asymmetric session tracking)
- **Media Management:** Multer & Cloudinary SDK

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory using the following template:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db
NODE_ENV=development
CLIENT_URL=http://localhost:3000

ACCESS_TOKEN_SECRET=your_minimum_10_char_access_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_minimum_10_char_refresh_secret_key
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🏁 Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Run the Server

For development mode with live-reloading via Nodemon:

```bash
npm run dev
```

For production environments:

```bash
npm start
```

---

## 📡 Core API Endpoints Reference

### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint         | Access    | Description                                                      |
| ------ | ---------------- | --------- | ---------------------------------------------------------------- |
| POST   | `/register`      | Public    | Registers a user (auto-hashes passwords via hooks)               |
| POST   | `/login`         | Public    | Authenticates user, issues access token, sets secure HTTP cookie |
| POST   | `/refresh-token` | Public    | Consumes refresh cookie, rotates keys, issues new tokens         |
| POST   | `/logout`        | Protected | Clears database refresh token records and drops client cookies   |

### 📁 Category & Product Management (`/api/v1/categories` & `/products`)

| Method | Endpoint          | Access     | Description                                                         |
| ------ | ----------------- | ---------- | ------------------------------------------------------------------- |
| GET    | `/categories`     | Public     | Fetches all available product categories alphabetically             |
| POST   | `/categories`     | Admin Only | Creates a category (auto-generates URL-friendly slug)               |
| GET    | `/products`       | Public     | Fetches all products (auto-populates category names)                |
| GET    | `/products/:slug` | Public     | Fetches detailed view of a product by its unique URL slug           |
| POST   | `/products`       | Admin Only | Handles up to 5 multi-part image uploads to Cloudinary + DB records |

### 🛒 Cart & Checkout Services (`/api/v1/cart` & `/orders`)

| Method | Endpoint           | Access    | Description                                                             |
| ------ | ------------------ | --------- | ----------------------------------------------------------------------- |
| GET    | `/cart`            | Protected | Fetches active user's persistent database cart details                  |
| POST   | `/cart`            | Protected | Adds/updates items in cart (validates against active stock levels)      |
| DELETE | `/cart/:productId` | Protected | Removes a target product item entirely from the user's cart             |
| POST   | `/orders/checkout` | Protected | Processes checkout, decrements inventory stock, creates immutable order |

---

## 🧼 Standardized API Response Structures

### Successful Response Format (2xx)

All successful requests return a uniform response managed by `ApiResponse` class:

```json
{
  "statusCode": 201,
  "data": { ... },
  "message": "Resource created successfully",
  "success": true
}
```

### Exceptional/Error Response Format (4xx / 5xx)

All handled and unhandled failures route through the centralized error middleware using the `ApiError` class:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation Failed",
  "errors": [{ "field": "price", "message": "Price cannot be negative" }],
  "stack": "Error stack trace..." // Automatically completely hidden in Production mode
}
```

## 👨‍💻 Author

**Tehseen Javed**  
Backend Developer <br>
Computer Systems Engineering Student @ Dawood University of Engineering & Technology <br><br>
GitHub: https://github.com/tehseen100 <br>
Linkedin: https://linkedin.com/in/tehseen100

---
