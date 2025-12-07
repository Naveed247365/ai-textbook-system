from fastapi import APIRouter

router = APIRouter()

@router.get("/profile")
async def get_profile():
    return {
        "user_id": 1,
        "username": "test_user",
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
async def update_preferences():
    return {"message": "Preferences updated successfully"}