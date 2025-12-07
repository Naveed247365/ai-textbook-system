from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ..auth_utils import get_current_user, TokenData

router = APIRouter()

# Profile models
class Preferences(BaseModel):
    language: str = "en"
    difficulty_level: str = "beginner"


class PersonalizationSettings(BaseModel):
    font_size: str = "normal"
    theme: str = "light"
    notifications_enabled: bool = True


class Profile(BaseModel):
    user_id: int = 1
    username: str
    preferences: Preferences
    personalization_settings: PersonalizationSettings


class ProfileUpdate(BaseModel):
    preferences: Optional[Preferences] = None
    personalization_settings: Optional[PersonalizationSettings] = None


@router.get("/profile", response_model=Profile)
async def get_profile(current_user: TokenData = Depends(get_current_user)):
    return {
        "user_id": 1,
        "username": current_user.username,
        "preferences": {
            "language": "en",
            "difficulty_level": "beginner"
        },
        "personalization_settings": {
            "font_size": "normal",
            "theme": "light",
            "notifications_enabled": True
        }
    }


@router.put("/profile/preferences")
async def update_preferences(profile_update: ProfileUpdate, current_user: TokenData = Depends(get_current_user)):
    return {"message": "Preferences updated successfully", "username": current_user.username}