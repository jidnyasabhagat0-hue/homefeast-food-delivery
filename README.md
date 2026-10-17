# HomeFeast — Homemade Food & Tiffin Subscription Platform

**HomeFeast** is a full-stack, responsive, and production-ready web application connecting customers with verified home cooks and tiffin service providers. It empowers customers to discover neighborhood home kitchens offering hygienic, preservative-free, homestyle meals while giving home chefs and homemakers tools to manage subscriptions, orders, and earnings.

---

## 1. Technology Stack

- **Frontend**:
  - React.js with Vite
  - Tailwind CSS for modern responsive styling (Cream `#fdfbf7` background, Forest Green `#15803d` primary, Culinary Orange `#ea580c` food accents)
  - React Router v6 for role-based navigation and protected dashboard routes
  - Lucide React for consistent UI iconography
- **Backend**:
  - Node.js & Express.js REST API
  - MongoDB with Mongoose ODM
  - Authentication: JSON Web Tokens (JWT) & bcrypt password hashing
  - Role-based Access Control (`customer`, `cook`, `admin`)
- **Deployment**:
  - Frontend: Configured for **Vercel** (`vite build`)
  - Backend: Configured for **Render** / Railway / Heroku

---

## 2. Project Directory Structure

```text
homefeast/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js         # Platform KPIs, cook approvals, dispute resolution
│   │   ├── authController.js          # Customer & Cook registration, login, JWT issuance
│   │   ├── complaintController.js     # Grievances & order dispute filing
│   │   ├── cookController.js          # Search, filters, cook profiles, earnings stats
│   │   ├── mealPlanController.js      # Daily, weekly, monthly plan CRUD
│   │   ├── menuController.js          # Dish inventory & availability toggles
│   │   ├── orderController.js         # Order creation, cook accept/reject, status pipeline
│   │   ├── reviewController.js        # Post-meal verified 1-5 star ratings
│   │   ├── subscriptionController.js  # Recurring meal subscription management
│   │   └── userController.js          # Address book & security settings
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT verification & token extraction
│   │   ├── errorMiddleware.js         # Centralized error handler
│   │   └── roleMiddleware.js          # Multi-role authorization guard
│   ├── models/
│   │   ├── Complaint.js               # Dispute schema with resolution status
│   │   ├── CookProfile.js             # Kitchen details, FSSAI verification, timings
│   │   ├── MealPlan.js                # Daily/Weekly/Monthly subscription tiers
│   │   ├── MenuItem.js                # Dish details, calories, dietary tags, prices
│   │   ├── Order.js                   # Single order tracking & delivery slot
│   │   ├── Review.js                  # 1-5 star ratings with duplicate prevention
│   │   ├── Subscription.js            # Active recurring meal schedule & progress
│   │   └── User.js                    # Customer, Cook, and Admin identities
│   ├── routes/                        # Express API route declarations
│   ├── seed/
│   │   └── seedData.js                # Database seeder with authentic Mumbai tiffins
│   ├── .env.example
│   ├── package.json
│   └── server.js                      # Main Express server entrypoint
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/                # Navbar, Footer, StatusBadge, Cards, Modals
    │   ├── context/                   # AuthContext with JWT session management
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx     # Moderation, cook approvals & platform GMV
    │   │   ├── CookDashboard.jsx      # Order progress, menu CRUD, earnings
    │   │   ├── CookProfilePage.jsx    # Menu showcase, plan subscriptions, reviews
    │   │   ├── CustomerDashboard.jsx  # Active deliveries, order tracking, address book
    │   │   ├── DiscoverPage.jsx       # Multi-variable search, filter, and sorting
    │   │   ├── HomePage.jsx           # Hero, categories, how it works, testimonials
    │   │   ├── LoginPage.jsx          # One-click demo roles & authentication
    │   │   ├── ProfileSettingsPage.jsx# Address book & password manager
    │   │   └── RegisterPage.jsx       # Customer and Cook registration flows
    │   ├── services/
    │   │   └── api.js                 # Unified REST client with Bearer auth headers
    │   ├── App.jsx                    # Route definitions & ProtectedRoute guards
    │   ├── index.css                  # Tailwind styles & theme variables
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 3. Database Models & Schema Design

| Model | Key Fields | Purpose |
| :--- | :--- | :--- |
| **User** | `name`, `email`, `phone`, `passwordHash`, `role`, `addresses[]`, `accountStatus` | Unified authentication for customers, cooks, and admins |
| **CookProfile** | `userId`, `businessName`, `cuisines[]`, `mealTypes[]`, `serviceAreas[]`, `fssaiNumber`, `approvalStatus`, `rating` | Kitchen storefront, verification credentials & coverage |
| **MenuItem** | `cookId`, `name`, `description`, `category`, `mealType`, `price`, `availability`, `calories` | Individual dish catalog with real-time stock toggles |
| **MealPlan** | `cookId`, `name`, `durationType`, `mealsIncluded[]`, `price`, `mealsCount`, `features[]` | Daily trial (1 day), weekly (6 days), and monthly (26 days) tiffins |
| **Order** | `orderNumber`, `customerId`, `cookId`, `items[]`, `deliveryAddress`, `deliveryTimeSlot`, `totalAmount`, `orderStatus` | Tracks meal orders through `Pending → Accepted → Preparing → Out for Delivery → Completed` |
| **Subscription**| `subNumber`, `customerId`, `cookId`, `mealPlanId`, `durationType`, `status`, `deliveredMeals`, `totalMeals` | Recurring meal plan tracking with delivery progress and pause controls |
| **Review** | `customerId`, `cookId`, `orderId`, `rating`, `comment`, `tags[]` | Verified reviews on completed orders with duplicate prevention |
| **Complaint** | `ticketNumber`, `customerId`, `orderId`, `subject`, `description`, `status`, `resolution` | Grievance tickets reviewed and resolved by platform admins |

---

## 4. REST API Endpoints

### Authentication & Users (`/api/auth`, `/api/users`)
- `POST /api/auth/register-customer` — Register a customer with default delivery address
- `POST /api/auth/register-cook` — Register a home cook (sets status to `pending` review)
- `POST /api/auth/login` — Sign in and receive JWT token with embedded user role
- `GET /api/auth/me` — Retrieve authenticated user profile and associated cook profile
- `PUT /api/users/profile` — Update name, phone, and personal details
- `POST /api/users/addresses` — Add a new saved delivery address

### Home Cooks & Discovery (`/api/cooks`)
- `GET /api/cooks` — Search and filter approved cooks by cuisine, area, diet, price, rating, and sort order
- `GET /api/cooks/:id` — Retrieve cook profile, menu items, meal plans, and customer reviews
- `PUT /api/cooks/my-profile` — Update kitchen bio, service areas, and delivery timings (Cook only)
- `GET /api/cooks/dashboard/stats` — Cook metrics: total orders, pending requests, active subs, total earnings

### Menus & Meal Plans (`/api/menu`, `/api/meal-plans`)
- `GET /api/menu/cook/:cookId` — Get active dishes for a specific cook
- `POST /api/menu` — Add a new dish to the kitchen menu (Cook only)
- `PUT /api/menu/:id` — Edit dish details, price, or toggle availability (Cook only)
- `DELETE /api/menu/:id` — Delete a dish from the menu (Cook only)
- `GET /api/meal-plans/cook/:cookId` — Get subscription tiers for a cook
- `POST /api/meal-plans` — Create daily, weekly, or monthly subscription packages (Cook only)

### Orders & Subscriptions (`/api/orders`, `/api/subscriptions`)
- `POST /api/orders` — Place a single meal order (Cash on Delivery / Pay on Delivery)
- `GET /api/orders` — List user's orders (Customer sees placed orders; Cook sees received orders)
- `PUT /api/orders/:id/status` — Advance preparation pipeline (`Accepted`, `Preparing`, `Out for Delivery`, `Completed`)
- `PUT /api/orders/:id/cancel` — Cancel pending order before cooking starts
- `POST /api/subscriptions` — Activate a daily, weekly, or monthly tiffin subscription
- `GET /api/subscriptions` — List active meal subscriptions with delivery tracking
- `PUT /api/subscriptions/:id/status` — Pause, resume, or cancel meal subscriptions

### Reviews & Support (`/api/reviews`, `/api/complaints`)
- `POST /api/reviews` — Submit verified 1–5 star rating for completed orders
- `GET /api/reviews/cook/:cookId` — Retrieve all reviews for a cook
- `POST /api/complaints` — Submit grievance ticket for an order
- `GET /api/complaints/my` — Customer view of reported tickets and admin resolutions

### Admin Desk (`/api/admin`)
- `GET /api/admin/stats` — Platform GMV, total customers, verified cooks, pending approvals
- `GET /api/admin/cooks/pending` — Queue of newly registered cooks requiring verification
- `PUT /api/admin/cooks/:id/approval` — Approve or reject cook applications
- `GET /api/admin/users` — Directory of all users with search and role filters
- `PUT /api/admin/users/:id/status` — Suspend or reactivate user accounts
- `GET /api/admin/complaints` — View all customer tickets
- `PUT /api/admin/complaints/:id/resolve` — Submit resolution notes and close grievances

---

## 5. Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017` or a MongoDB Atlas connection string

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Adjust MONGODB_URI and JWT_SECRET if using cloud MongoDB Atlas

# Seed the database with realistic Mumbai home cooks, dishes, and orders
npm run seed

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Vite development server
npm run dev
# Client runs on http://localhost:5173
```

---

## 6. Seed Credentials for Live Testing

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Customer** | `ananya@example.com` | `password123` | Active subscriber with orders in Powai |
| **Home Cook** | `chef.sunita@homefeast.in` | `password123` | Chef Sunita's Ghar Ka Khana (Andheri East) |
| **Super Admin**| `admin@homefeast.in` | `admin123` | Priya Sen — Full administrative oversight |
| **Pending Cook**| `chef.rajesh@homefeast.in` | `password123` | Rajesh Verma — Dilli Tiffin House (Pending verification) |

---

## 7. Deployment Instructions

### Deploying Backend to Render
1. Push the repository to GitHub.
2. In the Render Dashboard, create a **New Web Service**.
3. Point to your repository and set Root Directory to `backend`.
4. Configure Build & Start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, set:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<A strong random secret key>`
   - `FRONTEND_URL`: `https://your-homefeast-frontend.vercel.app`

### Deploying Frontend to Vercel
1. In Vercel, click **Add New Project** and import your repository.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-homefeast-backend.onrender.com`
5. Deploy! Vercel handles automated SSL certificates and CDN edge distribution.
