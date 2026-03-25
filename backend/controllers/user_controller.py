# controllers/user_controller.py  –  User authentication endpoints
from fastapi import APIRouter
from models.schemas import (
    UserRegistrationRequest,
    UserSignInRequest,
    AuthResponse,
    UserResponse,
)
from repositories.user_repository import user_repository
from datetime import datetime

router = APIRouter(prefix="/api/users", tags=["Users"])


# ── POST /api/users/register  –  Register new user ───────────
@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=201,
    summary="Register a new user",
)
def register(body: UserRegistrationRequest):
    try:
        user = user_repository.register_user(body.name, body.email, body.password)
        return AuthResponse(
            status="success",
            message="User registered successfully! You can now sign in.",
            user=UserResponse(
                user_id=user['user_id'],
                name=user['name'],
                email=user['email'],
                created_at=user['created_at'],
            ),
        )
    except ValueError as e:
        return AuthResponse(
            status="error",
            message=str(e),
        )
    except Exception as e:
        return AuthResponse(
            status="error",
            message="Registration failed. Please try again.",
        )


# ── POST /api/users/signin  –  Sign in user ──────────────────
@router.post(
    "/signin",
    response_model=AuthResponse,
    summary="Sign in user",
)
def signin(body: UserSignInRequest):
    try:
        user = user_repository.verify_user(body.email, body.password)
        
        if not user:
            return AuthResponse(
                status="error",
                message="Invalid email or password.",
            )
        
        return AuthResponse(
            status="success",
            message="Sign in successful!",
            user=UserResponse(
                user_id=user['user_id'],
                name=user['name'],
                email=user['email'],
                created_at=user['created_at'],
            ),
        )
    except Exception as e:
        return AuthResponse(
            status="error",
            message="Sign in failed. Please try again.",
        )
