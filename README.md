# CoffeeWeb-404

A coffee shop storefront and management system. Customers can browse and customize drinks, place orders, and choose a payment method. Staff can manage products, orders, inventory, customers, employees, payments, and sales reports.

The app uses React and Vite for the frontend, FastAPI for the backend, and SQLite for data storage.

## Features

### Customer storefront

- Browse and search the drinks menu by category.
- Customize drink size, sweetness, and other available options.
- Manage a cart and apply promo codes:
  - `WELCOME10`: 10% off, no minimum.
  - `COFFEE15`: 15% off orders of $10 or more.
  - `SWEET20`: 20% off orders of $20 or more.
- Place orders for pickup or delivery and select KHQR / Bakong / ABA, credit or debit card, or cash on delivery.
- View prices in USD and Khmer riel.

### Admin portal

- Review revenue, orders, customers, products, and low-stock items on the dashboard.
- Manage products and categories.
- Track orders and update their fulfillment status.
- Manage customers, employees, inventory, and payment records.
- Export top-selling product data as CSV.

### Reports

Choose a rolling period of **1 day**, **1 week**, **1 month**, or **1 year**. Reports default to 1 month and filter revenue, order status counts, and product sales to the selected period.

Revenue is the sum of order totals, excluding cancelled and refunded orders. The report periods cover the previous 24 hours, 7 days, 30 days, or 365 days.

## Technology

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, Lucide |
| Backend | Python, FastAPI, SQLAlchemy, Pydantic |
| Database | SQLite |
| Authentication | JWT and bcrypt |

## Run locally

### Requirements

- Python 3.10 or newer
- Node.js 18 or newer and npm

### 1. Start the backend

From the project root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment, then install dependencies and start FastAPI:

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

On macOS or Linux, activate it with `source .venv/bin/activate` instead.

The backend creates the SQLite tables at startup and seeds sample records when the database has no users. The seeded admin account is `admin` / `admin123`.

### 2. Start the frontend

In a second terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend connects to `http://localhost:8000/api` by default.

If the backend uses another address or port, set `VITE_API_URL` in `frontend/.env.local`, for example:

```env
VITE_API_URL=http://localhost:8001/api
```

Restart Vite after changing the environment file.

## Demo access

| Role | Login |
| --- | --- |
| Admin | Username: `admin` · Password: `admin123` |
| Customer | Register an account from the storefront |

## API documentation

With the backend running:

- API base: [http://localhost:8000/api](http://localhost:8000/api)
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Project structure

```text
frontend/
  public/images/       Storefront and product images
  src/components/      Shared storefront and admin components
  src/context/         Authentication and cart state
  src/pages/           Storefront, checkout, and admin pages
  src/services/        API client and currency utilities
backend/
  main.py              FastAPI app, database setup, and seed data
  models.py            SQLAlchemy database models
  schemas.py           Pydantic request and response schemas
  routers/             Auth, catalog, orders, operations, and reports APIs
  uploads/             Uploaded product images
```
