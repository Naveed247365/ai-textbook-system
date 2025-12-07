from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import timedelta
from ..auth_utils import create_access_token, get_current_user, Token, TokenData

router = APIRouter()

# Auth models
class LoginRequest(BaseModel):
    username: str
    password: str


class User(BaseModel):
    username: str
    email: str = None
    full_name: str = None
    disabled: bool = None


class UserInDB(User):
    hashed_password: str


# Mock user database - in a real app, this would be a proper database
fake_users_db = {
    "test_user": {
        "username": "test_user",
        "email": "test@example.com",
        "full_name": "Test User",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6LruGZRknBrtPMay",  # fake hash
        "disabled": False,
    }
}


def authenticate_user(username: str, password: str):
    """Authenticate user against the mock database"""
    user = fake_users_db.get(username)
    if not user:
        return False
    # In a real app, we would verify the password hash here
    return user


@router.post("/token", response_model=Token)
async def login_for_access_token(request: LoginRequest):
    """Login endpoint that returns a JWT token"""
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token that expires in 30 minutes
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me")
async def read_users_me(current_user: TokenData = Depends(get_current_user)):
    """Protected endpoint that returns current user info"""
    return {"username": current_user.username, "preferences": {"language": "en", "difficulty": "beginner"}}