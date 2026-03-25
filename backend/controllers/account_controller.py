# controllers/account_controller.py  –  REST layer (FastAPI Router)
from fastapi import APIRouter
from models.schemas import (
    CreateAccountRequest,
    CreateAccountForUserRequest,
    AmountRequest,
    UpdateAccountRequest,
    AccountResponse,
    AccountListResponse,
    TransactionResponse,
    OperationResponse,
)
from services.account_service import account_service

router = APIRouter(prefix="/api/accounts", tags=["Accounts"])


# ── POST /api/accounts  –  Create account ────────────────────
@router.post(
    "/",
    response_model=AccountResponse,
    status_code=201,
    summary="Create a new bank account",
)
def create_account(body: CreateAccountRequest):
    return account_service.create_account(body.name, body.email, body.account_type)


# ── POST /api/accounts/create-for-user/{user_id}  –  Create account for user ──────
@router.post(
    "/create-for-user/{user_id}",
    response_model=AccountResponse,
    status_code=201,
    summary="Create a new account for authenticated user",
)
def create_account_for_user(user_id: int, body: CreateAccountForUserRequest):
    return account_service.create_account_for_user(user_id, body.account_type)


# ── GET /api/accounts/user/{user_id}  –  List user accounts ──
# NOTE: This must come BEFORE the /{account_id} route to avoid conflicts
@router.get(
    "/user/{user_id}",
    response_model=list[AccountListResponse],
    summary="Get all accounts for a user",
)
def get_user_accounts(user_id: int):
    return account_service.get_user_accounts(user_id)


# ── GET /api/accounts/{id}  –  Get account details ───────────
@router.get(
    "/{account_id}",
    response_model=AccountResponse,
    summary="Get account details by ID",
)
def get_account(account_id: int):
    return account_service.get_account(account_id)


# ── POST /api/accounts/{id}/deposit  –  Deposit money ────────
@router.post(
    "/{account_id}/deposit",
    response_model=OperationResponse,
    summary="Deposit money into an account",
)
def deposit(account_id: int, body: AmountRequest):
    return account_service.deposit(account_id, body.amount)


# ── POST /api/accounts/{id}/withdraw  –  Withdraw money ──────
@router.post(
    "/{account_id}/withdraw",
    response_model=OperationResponse,
    summary="Withdraw money from an account",
)
def withdraw(account_id: int, body: AmountRequest):
    return account_service.withdraw(account_id, body.amount)


# ── PUT /api/accounts/{id}  –  Update account type ───────────
@router.put(
    "/{account_id}",
    response_model=AccountResponse,
    summary="Update account type",
)
def update_account(account_id: int, body: UpdateAccountRequest):
    return account_service.update_account(account_id, body.account_type)


# ── DELETE /api/accounts/{id}  –  Delete account ─────────────
@router.delete(
    "/{account_id}",
    status_code=204,
    summary="Delete an account",
)
def delete_account(account_id: int):
    account_service.delete_account(account_id)
    return None


# ── GET /api/accounts/{id}/transactions  –  History ──────────
@router.get(
    "/{account_id}/transactions",
    response_model=list[TransactionResponse],
    summary="Get transaction history for an account",
)
def get_transactions(account_id: int):
    return account_service.get_transactions(account_id)
