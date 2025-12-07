from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Minimal auth implementation for now
class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    return {"message": "Login successful", "token": "fake_token_for_now"}


@router.get("/me")
async def get_current_user():
    return {"username": "test_user", "preferences": {"language": "en", "difficulty": "beginner"}}