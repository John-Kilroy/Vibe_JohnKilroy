# main.py  –  FastAPI application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.account_controller import router as account_router
from controllers.user_controller import router as user_router

app = FastAPI(
    title="NovaBanc – Simple Banking API",
    description=(
        "A beginner-friendly REST API demonstrating MVC architecture with FastAPI, "
        "MySQL, and a React frontend. Covers account creation, deposits, withdrawals, "
        "and transaction history."
    ),
    version="1.0.0",
)

# ── CORS (allow React dev server) ────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(account_router)
app.include_router(user_router)


# ── Health check ──────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
