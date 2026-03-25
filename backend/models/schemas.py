# models/schemas.py  –  Pydantic request & response models
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Literal, Optional


# ── Request bodies ────────────────────────────────────────────
class CreateAccountRequest(BaseModel):
    name: str
    email: EmailStr
    account_type: Literal["SAVINGS", "CHECKING", "FIXED_DEPOSIT"]

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name must not be blank")
        return v.strip()


class AmountRequest(BaseModel):
    amount: float

    @field_validator("amount")
    @classmethod
    def must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("amount must be a positive number")
        return round(v, 2)


class UpdateAccountRequest(BaseModel):
    account_type: Literal["SAVINGS", "CHECKING", "FIXED_DEPOSIT"]


class CreateAccountForUserRequest(BaseModel):
    account_type: Literal["SAVINGS", "CHECKING", "FIXED_DEPOSIT"]


# ── Response shapes ───────────────────────────────────────────
class AccountResponse(BaseModel):
    account_id: int
    user_id: int
    user_name: str
    email: str
    account_type: str
    balance: float
    created_at: datetime


class AccountListResponse(BaseModel):
    account_id: int
    account_type: str
    balance: float
    created_at: datetime


class TransactionResponse(BaseModel):
    txn_id: int
    account_id: int
    type: str
    amount: float
    date: datetime


class OperationResponse(BaseModel):
    account_id: int
    new_balance: float
    transaction: TransactionResponse


# ── User Authentication ──────────────────────────────────────
class UserRegistrationRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name must not be blank")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("password must be at least 6 characters")
        return v


class UserSignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    created_at: datetime


class AuthResponse(BaseModel):
    status: str
    message: str
    user: Optional[UserResponse] = None
