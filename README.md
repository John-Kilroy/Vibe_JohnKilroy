# 🏦 NovaBanc — Simple Banking Application (Python Edition)

A full-stack beginner project demonstrating **MVC architecture**, **REST APIs**, **MySQL database design**, and **React frontend integration**.

---

## 📁 Project Structure

```
banking-app-python/
├── backend/                        # Python / FastAPI REST API
│   ├── config/
│   │   └── database.py             # MySQL connection pool
│   ├── models/
│   │   └── schemas.py              # Pydantic request & response models
│   ├── repositories/               # SQL queries
│   │   ├── user_repository.py
│   │   ├── account_repository.py
│   │   └── transaction_repository.py
│   ├── services/
│   │   └── account_service.py      # Business logic layer
│   ├── controllers/
│   │   └── account_controller.py   # FastAPI router (REST endpoints)
│   ├── main.py                     # FastAPI app entry point
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                       # React 18 SPA  (unchanged)
│   ├── public/index.html
│   └── src/
│       ├── api/bankApi.js
│       ├── pages/  (Home, CreateAccount, ViewAccount, AccountDetails,
│       │            Deposit, Withdraw, TransactionHistory)
│       ├── App.js
│       ├── App.css
│       └── index.js
│
├── database.sql                    # DB schema + seed data
├── postman_collection.json         # Ready-to-import Postman collection
└── README.md
```

---

## ⚙️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Python 3.11+, FastAPI, Uvicorn |
| Frontend   | React 18, React Router 6      |
| Database   | MySQL 8+                      |
| Dev Tools  | VS Code, Postman, Swagger UI  |

---

## 🗄️ Database Setup

```bash
mysql -u root -p < database.sql
```

This creates the `simple_bank` database with the `users`, `accounts`, and `transactions` tables, plus optional seed data.

---

## 🔧 Backend Setup (Python / FastAPI)

```bash
cd banking-app/backend

# 1. Create and activate a virtual environment (recommended)
python -m venv venv
source venv/Scripts/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**

### 📄 Auto-generated Swagger UI

FastAPI generates interactive API docs automatically — no extra setup needed:

| Page         | URL                                   |
|--------------|---------------------------------------|
| Swagger UI   | http://localhost:8000/docs            |
| ReDoc        | http://localhost:8000/redoc           |

### API Endpoints

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/api/accounts/`                      | Create account           |
| GET    | `/api/accounts/{id}`                  | Get account details      |
| POST   | `/api/accounts/{id}/deposit`          | Deposit money            |
| POST   | `/api/accounts/{id}/withdraw`         | Withdraw money           |
| GET    | `/api/accounts/{id}/transactions`     | Transaction history      |
| GET    | `/health`                             | Health check             |

---

## 💻 Frontend Setup (React)

```bash
cd banking-app/frontend

npm install
npm start
```

Opens at **http://localhost:3000** — the `"proxy": "http://localhost:8000"` in `package.json` automatically forwards all `/api/*` calls to FastAPI.

---

## 📮 Postman

1. Open Postman → **Import** → select `postman_collection.json`
2. The `base_url` variable is pre-set to `http://localhost:8000`
3. Run in order: **Create → Deposit → Withdraw → History**

> Note: field names in request bodies use `snake_case` (e.g. `account_type`) to match Python conventions.

---

## 🏛️ Architecture

```
React UI  →  bankApi.js  →  FastAPI Controller  →  Service Layer  →  Repository  →  MySQL
(pages)      (fetch)        (account_controller)   (account_service) (Repo classes)
```

### MVC Separation

| Layer          | File(s)                              | Responsibility                        |
|----------------|--------------------------------------|---------------------------------------|
| Model          | `models/schemas.py`                  | Pydantic request/response validation  |
| Repository     | `repositories/*.py`                  | All SQL queries, returns dicts        |
| Service        | `services/account_service.py`        | Business rules, balance checks        |
| Controller     | `controllers/account_controller.py`  | HTTP routing, calls service           |
| View           | `frontend/src/pages/`                | React components                      |

---

## 📐 Business Rules

- Deposit amount must be **positive** (validated by Pydantic before hitting the DB)
- Cannot withdraw **more than current balance** (HTTP 422 with clear message)
- Every deposit and withdrawal creates a **Transaction record**
- A user with a given email is **reused** if they already exist

---

## ✨ Bonus Enhancements (for practice)

- [ ] JWT authentication (`python-jose`, `passlib`)
- [ ] Transfer between accounts
- [ ] Pagination for transaction history (`skip` / `limit` query params)
- [ ] Unit tests (`pytest`, `httpx` test client)
- [ ] Docker / docker-compose setup

---

## 📋 Submission Checklist

- [x] Source code (this repo)
- [x] SQL script (`database.sql`)
- [x] Postman collection (`postman_collection.json`)
- [x] Swagger UI (auto-generated at `/docs`)
- [ ] Screenshots of UI (add after running)

---
