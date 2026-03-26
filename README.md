# 🏦 NovaBanc — Simple Banking Application (Flask + MongoDB + React)

A full-stack beginner project demonstrating **MVC architecture**, **REST APIs**, **MongoDB (NoSQL) database design**, and **React JSX frontend integration**.

---

## 📁 Project Structure

```
banking-app-flask/
├── backend/
│   ├── config/
│   │   └── database.py             # PyMongo connection + collection handles
│   ├── models/
│   │   └── serializers.py          # BSON → JSON-safe dict converters
│   ├── repositories/
│   │   ├── user_repository.py      # MongoDB CRUD for users
│   │   ├── account_repository.py   # MongoDB CRUD for accounts
│   │   └── transaction_repository.py
│   ├── services/
│   │   └── account_service.py      # Business logic layer
│   ├── controllers/
│   │   └── account_controller.py   # Flask Blueprint (REST endpoints)
│   ├── main.py                     # Flask app entry point
│   ├── seed.py                     # Seed MongoDB with demo data
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── api/bankApi.js
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── CreateAccount.jsx
│       │   ├── ViewAccount.jsx
│       │   ├── AccountDetails.jsx
│       │   ├── Deposit.jsx
│       │   ├── Withdraw.jsx
│       │   └── TransactionHistory.jsx
│       ├── App.jsx
│       ├── App.css
│       └── index.jsx
│
├── postman_collection.json
└── README.md
```

---

## ⚙️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python 3.11+, Flask 3, flask-cors   |
| Database   | MongoDB 7+ (local) or MongoDB Atlas |
| ODM        | PyMongo (direct driver, no ORM)     |
| Frontend   | React 18, React Router 6 (.jsx)     |
| Dev Tools  | VS Code, Postman, MongoDB Compass   |

---

## 🗄️ MongoDB Setup

MongoDB does **not** use SQL or schema files. Choose one option:

### Option A — Local MongoDB
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start the service: `mongod` (or via MongoDB Compass)
3. The app creates the `simple_bank` database and collections automatically on first use.
4. Optionally seed demo data: `python seed.py`

### Option B — MongoDB Atlas (Cloud, Free Tier)
1. Create a free cluster at https://cloud.mongodb.com
2. Copy your connection string into `.env` as `MONGO_URI`

---

## 🔧 Backend Setup (Python / Flask)

```bash
cd banking-app-flask/backend

# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env — set MONGO_URI and MONGO_DB

# 4. (Optional) seed demo data
python seed.py

# 5. Start Flask
python main.py
```

Flask runs at **http://localhost:5000**

### API Endpoints

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/api/accounts/`                      | Create account           |
| GET    | `/api/accounts/<id>`                  | Get account details      |
| POST   | `/api/accounts/<id>/deposit`          | Deposit money            |
| POST   | `/api/accounts/<id>/withdraw`         | Withdraw money           |
| GET    | `/api/accounts/<id>/transactions`     | Transaction history      |
| GET    | `/health`                             | Health check             |

> **Note on IDs**: MongoDB uses 24-character hex **ObjectId** strings as primary keys, not integers. Example: `6650a3f2c1b4e800123abcde`. Copy the `account_id` returned from POST `/api/accounts/` to use in subsequent requests.

---

## 💻 Frontend Setup (React JSX)

```bash
cd banking-app-flask/frontend
npm install
npm start
```

Opens at **http://localhost:3000** — the proxy in `package.json` forwards `/api/*` to Flask automatically.

---

## 📐 MongoDB Data Model

Unlike SQL, MongoDB stores documents (JSON-like objects) with no fixed schema.

### users collection
```json
{
  "_id":        ObjectId("..."),
  "name":       "Alice Johnson",
  "email":      "alice@example.com",
  "created_at": ISODate("2026-03-26T...")
}
```

### accounts collection
```json
{
  "_id":          ObjectId("..."),
  "user_id":      ObjectId("..."),   ← references users._id
  "balance":      1500.00,
  "account_type": "SAVINGS",
  "created_at":   ISODate("...")
}
```

### transactions collection
```json
{
  "_id":        ObjectId("..."),
  "account_id": ObjectId("..."),     ← references accounts._id
  "txn_type":   "DEPOSIT",
  "amount":     500.00,
  "created_at": ISODate("...")
}
```

---

## 🏛️ Architecture (MVC)

```
React JSX  →  bankApi.js  →  Flask Blueprint  →  Service Layer  →  Repository  →  MongoDB
(pages)       (fetch)        (account_controller) (account_service) (PyMongo)
```

| Layer       | File                              | Responsibility                     |
|-------------|-----------------------------------|------------------------------------|
| Model       | `models/serializers.py`           | Convert BSON docs to JSON dicts    |
| Repository  | `repositories/*.py`               | All PyMongo queries                |
| Service     | `services/account_service.py`     | Business rules + validation        |
| Controller  | `controllers/account_controller.py` | HTTP routing via Flask Blueprint |
| View        | `frontend/src/pages/*.jsx`        | React components                   |

---

## 📐 Business Rules

- `account_type` must be `SAVINGS`, `CHECKING`, or `FIXED_DEPOSIT`
- Deposit amount must be **positive**
- Cannot withdraw **more than current balance** (HTTP 422)
- Every deposit/withdrawal creates a **transaction document** in MongoDB
- If a user with the given email already exists, they are reused (no duplicate users)

---

## 📮 Postman

1. Import `postman_collection.json` into Postman
2. Run **Create Account** first — copy the returned `account_id`
3. Paste it into the `account_id` collection variable
4. Run Deposit → Withdraw → Transaction History

---

## ✨ Bonus Enhancements (for practice)

- [ ] JWT authentication (`flask-jwt-extended`)
- [ ] MongoDB Atlas Search for transaction filtering
- [ ] Transfer between accounts
- [ ] Pagination (`skip` / `limit` in PyMongo)
- [ ] Unit tests (`pytest` + `mongomock`)
- [ ] Docker + docker-compose with MongoDB service

---

## 📋 Submission Checklist

- [x] Source code
- [x] `seed.py` (replaces SQL script for NoSQL)
- [x] Postman collection
- [ ] Screenshots of UI

---

*Built for the Simple Bank Application student project.*
