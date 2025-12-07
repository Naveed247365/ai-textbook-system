from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from src.translation_service import translation_service, translation_cache

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en"
    target_language: str = "ur"
    difficulty_level: str = "beginner"  # "beginner" or "advanced"


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    difficulty_level: str
    from_cache: bool

@router.post("/translate", response_model=TranslationResponse)
async def translate_content(request: TranslationRequest):
    """Translate content from source to target language"""
    try:
        # First check if translation is already in cache
        cached_translation = await translation_cache.get_cached_translation(
            request.text, request.source_language, request.target_language, request.difficulty_level
        )
        
        if cached_translation:
            return TranslationResponse(
                original_text=request.text,
                translated_text=cached_translation,
                source_language=request.source_language,
                target_language=request.target_language,
                difficulty_level=request.difficulty_level,
                from_cache=True
            )
        
        # Perform translation using AI service
        translated_text = await translation_service.translate_text(
            request.text,
            request.source_language,
            request.target_language,
            request.difficulty_level,
            "gemini"  # Default service
        )
        
        # Cache the translation
        await translation_cache.cache_translation(
            request.text, request.source_language, request.target_language, translated_text, request.difficulty_level
        )
        
        return TranslationResponse(
            original_text=request.text,
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language,
            difficulty_level=request.difficulty_level,
            from_cache=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")