import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio
import logging
from contextlib import asynccontextmanager

from .ai_adapters import translation_adapter_manager

class TranslationService:
    """Handles AI-based translation between English and Urdu"""

    def __init__(self):
        self.adapter_manager = translation_adapter_manager

    async def translate_text(self, text: str, source_lang: str, target_lang: str, difficulty: str = "beginner", service: str = "gemini") -> str:
        """
        Translate text from source language to target language using AI
        """
        if source_lang == target_lang:
            return text

        try:
            # Use the appropriate AI service for translation
            translated_text = await self.adapter_manager.translate(
                text=text,
                source_lang=source_lang,
                target_lang=target_lang,
                difficulty=difficulty,
                service=service
            )
            return translated_text
        except Exception as e:
            logging.error(f"Translation API error: {str(e)}")
            # Fallback to simple indication of language
            if target_lang == "ur":
                return f"[URDU_TRANSLATION: {text[:30]}...]"
            else:
                return f"[ENGLISH_TRANSLATION: {text[:30]}...]"


import asyncpg
import json

class TranslationCache:
    """Handles caching of translations in Neon/Postgres"""

    def __init__(self):
        self.cache = {}  # In-memory cache as fallback
        self.connection_pool = None  # Will hold connection to Neon/Postgres

    async def initialize_db(self):
        """Initialize database connection to Neon/Postgres"""
        try:
            # In a real implementation, these would come from environment variables
            db_url = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/dbname")
            self.connection_pool = await asyncpg.create_pool(dsn=db_url)

            # Create table if it doesn't exist
            async with self.connection_pool.acquire() as conn:
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS translation_cache (
                        id SERIAL PRIMARY KEY,
                        source_text TEXT NOT NULL,
                        source_language VARCHAR(10) NOT NULL,
                        target_language VARCHAR(10) NOT NULL,
                        translated_text TEXT NOT NULL,
                        difficulty_level VARCHAR(20) DEFAULT 'beginner',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days'
                    );
                """)

                # Create indexes for efficient lookup
                await conn.execute("""
                    CREATE INDEX IF NOT EXISTS idx_source_target ON translation_cache(source_text, source_language, target_language);
                    CREATE INDEX IF NOT EXISTS idx_expires_at ON translation_cache(expires_at);
                """)
        except Exception as e:
            logging.warning(f"Could not connect to PostgreSQL, using in-memory cache: {str(e)}")
            self.connection_pool = None

    async def get_cached_translation(self, text: str, source_lang: str, target_lang: str, difficulty: str = "beginner") -> Optional[str]:
        """Retrieve cached translation if it exists"""
        # First check in-memory cache
        cache_key = f"{source_lang}:{target_lang}:{difficulty}:{text}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        # If not in memory and we have DB connection, check DB
        if self.connection_pool:
            try:
                async with self.connection_pool.acquire() as conn:
                    result = await conn.fetchrow("""
                        SELECT translated_text FROM translation_cache
                        WHERE source_text = $1 AND source_language = $2 AND target_language = $3 AND difficulty_level = $4
                        AND expires_at > CURRENT_TIMESTAMP
                    """, text, source_lang, target_lang, difficulty)

                    if result:
                        db_translation = result['translated_text']
                        # Also cache in memory for faster access
                        self.cache[cache_key] = db_translation
                        return db_translation
            except Exception as e:
                logging.error(f"Database cache error: {str(e)}")
                # Fall back to in-memory cache
                return self.cache.get(cache_key)

        return None

    async def cache_translation(self, text: str, source_lang: str, target_lang: str, translation: str, difficulty: str = "beginner"):
        """Store translation in both DB and in-memory cache"""
        cache_key = f"{source_lang}:{target_lang}:{difficulty}:{text}"

        # Store in memory cache
        self.cache[cache_key] = translation

        # Store in database if connection available
        if self.connection_pool:
            try:
                async with self.connection_pool.acquire() as conn:
                    await conn.execute("""
                        INSERT INTO translation_cache
                        (source_text, source_language, target_language, translated_text, difficulty_level)
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (source_text, source_language, target_language, difficulty_level)
                        DO UPDATE SET translated_text = $4, created_at = CURRENT_TIMESTAMP
                    """, text, source_lang, target_lang, translation, difficulty)
            except Exception as e:
                logging.error(f"Database cache store error: {str(e)}")
                # Still keep the in-memory cache


# Initialize services
translation_cache = TranslationCache()
translation_service = TranslationService()

# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("Initializing translation service...")
    await translation_cache.initialize_db()
    logging.info("Translation service started")
    yield
    # Shutdown
    logging.info("Translation service shutting down")
    # Close database connections if they exist
    if translation_cache.connection_pool:
        await translation_cache.connection_pool.close()


app = FastAPI(title="Translation Service for Physical AI & Robotics Textbook", lifespan=lifespan)

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


@app.post("/translate", response_model=TranslationResponse)
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
            "gemini"  # Default service, could be configurable
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
        logging.error(f"Translation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Translation Service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)