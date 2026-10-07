# ☕ Coffee Shop Management & Storefront Web Application

A full-stack specialty coffee shop platform built with **React.js** (Frontend) and **FastAPI** (Backend) using **SQLite** for relational persistence.

---

## 📁 Project Architecture & Directory Structure

```text
coffee-shop/
│
├── frontend/                         # React.js (Vite + Context API)
│   ├── public/
│   │   └── images/
│   │       ├── logo.png              # Brand icon
│   │       ├── coffee-1.png          # Signature Espresso
│   │       ├── coffee-2.png          # Vanilla Latte
│   │       ├── coffee-3.png          # Iced Americano
│   │       ├── matcha.png            # Ceremonial Matcha
│   │       └── milk-tea.png          # Brown Sugar Milk Tea
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Storefront navigation bar
│   │   │   ├── Sidebar.jsx           # Admin navigation sidebar
│   │   │   ├── Header.jsx            # Admin top header bar
│   │   │   ├── ProductCard.jsx       # Catalog product card
│   │   │   ├── ProductModal.jsx      # Product customization & options popup
│   │   │   ├── Cart.jsx              # Slide-over quick cart drawer
│   │   │   ├── OrderTable.jsx        # Reusable orders table with status badges
│   │   │   ├── StatCard.jsx          # KPI analytics card
│   │   │   └── Footer.jsx            # Storefront footer
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx             # User & Admin authentication
│   │   │   ├── Register.jsx          # Customer registration
│   │   │   ├── Home.jsx              # Hero landing page & featured roasts
│   │   │   ├── Menu.jsx              # Full categorized menu with search
│   │   │   ├── ProductDetail.jsx     # Single beverage detail view
│   │   │   ├── CartPage.jsx          # Complete cart checkout preparation
│   │   │   ├── Checkout.jsx          # Customer details & payment selection
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx     # Overview metrics & recent activity
│   │   │       ├── Products.jsx      # Product catalog management
│   │   │       ├── Categories.jsx    # Beverage category management
│   │   │       ├── Orders.jsx        # Order status tracking & management
│   │   │       ├── Customers.jsx     # Customer accounts & order history
│   │   │       ├── Employees.jsx     # Staff roster, roles, and shifts
│   │   │       ├── Inventory.jsx     # Raw beans, dairy, packaging stock
│   │   │       ├── Payments.jsx      # Payment transaction ledger
│   │   │       └── Reports.jsx       # Revenue reports and CSV export
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT interceptor
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User authentication & session state
│   │   │   └── CartContext.jsx       # Cart state & localStorage sync
│   │   │
│   │   ├── App.jsx                   # Application routing configuration
│   │   ├── App.css                   # Comprehensive modern styling
│   │   └── main.jsx                  # React DOM entry point
│   │
│   ├── index.html                    # HTML entry template
│   ├── vite.config.js                # Vite build configuration
│   └── package.json                  # Frontend dependencies & scripts
│
├── backend/                          # FastAPI (Python + SQLAlchemy)
│   ├── main.py                       # FastAPI entrypoint, CORS & DB seeder
│   ├── database.py                   # SQLAlchemy SQLite configuration
│   ├── models.py                     # Database tables & relations
│   ├── schemas.py                    # Pydantic validation schemas
│   ├── auth.py                       # JWT token creation & bcrypt password hashing
│   │
│   ├── routers/
│   │   ├── auth.py                   # Register, login, current user endpoints
│   │   ├── products.py               # Products CRUD
│   │   ├── categories.py             # Categories CRUD
│   │   ├── orders.py                 # Orders creation & status changes
│   │   ├── customers.py              # Customer management
│   │   ├── employees.py              # Employee roster management
│   │   ├── inventory.py              # Inventory levels & threshold alerts
│   │   ├── payments.py               # Payment logging
│   │   └── reports.py                # Dashboard stats & sales reports
│   │
│   ├── uploads/                      # Uploaded asset storage directory
│   ├── coffee_shop.db                # SQLite database file
│   └── requirements.txt              # Python dependencies
│
└── README.md                         # Documentation & getting started guide
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. The API will now be accessible at:
   - Base URL: `http://localhost:8000`
   - Interactive Swagger Docs: `http://localhost:8000/docs`
   - Alternative ReDoc: `http://localhost:8000/redoc`

> **Note on Initial Data**: On its first run, `main.py` automatically initializes SQLite tables and seeds an admin account along with sample drinks, categories, inventory items, and staff.

---

### 3. Frontend Setup (React.js)

1. Open another terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 🔐 Default Demo Accounts

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full Admin Hub (`/admin`) + Storefront |
| **Customer** | *(Register any account)* | *(Your password)* | Storefront, Cart, Checkout |

---

## 🛠️ Key Features

### 🛍️ Storefront (Customer Experience)
- **Hero & Storytelling**: Visual landing page showcasing specialty beans, daily roasts, and customer ratings.
- **Categorized Menu**: Instant real-time filtering by category (Espresso, Tea/Matcha, Bakery) with live search.
- **Custom Drink Options**: Customize cup sizes (Small, Medium, Large) and sweetness levels (0%, 50%, 100%).
- **Cart Management**: Quick slide-over drawer accessible from any page, plus a dedicated `/cart` page with promo discount codes (`COFFEE10`).
- **Checkout Flow**: Customer details, pickup/delivery instructions, and payment methods (Card, Mobile Banking / PromptPay, Cash).

### 📊 Admin Portal (`/admin`)
- **Dashboard**: Live KPIs for Gross Revenue, Orders Count, Customer Count, and Low Stock alerts.
- **Products & Categories**: Full CRUD management with pricing, stock status, and category linking.
- **Order Management**: Monitor incoming orders and update statuses (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Completed` ➔ `Cancelled`).
- **Staff Roster**: Manage baristas and managers, shift assignments, and payroll records.
- **Raw Inventory Tracking**: Real-time stock counts for beans, milk, and packaging with minimum threshold alerts.
- **Payment Ledger & CSV Reports**: Transaction tracking and exportable sales data.

