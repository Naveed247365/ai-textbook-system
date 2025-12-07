from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import logging
from contextlib import asynccontextmanager
from .rag_service import RAGService

# Pydantic models
class RAGQuery(BaseModel):
    query: str
    target_language: str = "en"  # Default to English
    difficulty_level: str = "beginner"  # Default to beginner
    top_k: int = 5  # Number of context items to retrieve


class RAGResponse(BaseModel):
    query: str
    response: str
    source_language: str
    target_language: str
    difficulty_level: str
    context_used: List[str]
    retrieved_context_count: int


# Initialize RAG service
rag_service = RAGService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("RAG service initializing...")
    # We could preload models here if needed
    logging.info("RAG service initialized")
    yield
    # Shutdown
    logging.info("RAG service shutting down")


app = FastAPI(
    title="RAG Service for Physical AI & Robotics Textbook",
    description="Retrieval-Augmented Generation service with multilingual and difficulty support",
    version="1.0.0",
    lifespan=lifespan
)


@app.post("/answer", response_model=RAGResponse)
async def answer_query(query_data: RAGQuery):
    """Answer a query using RAG with language and difficulty considerations"""
    try:
        # Set user preferences
        await rag_service.set_user_preferences(
            language=query_data.target_language,
            difficulty=query_data.difficulty_level
        )
        
        # Get answer from RAG service
        result = await rag_service.answer_query(
            query=query_data.query,
            target_language=query_data.target_language,
            difficulty=query_data.difficulty_level,
            top_k=query_data.top_k
        )
        
        return RAGResponse(**result)
    except Exception as e:
        logging.error(f"RAG service error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")


@app.post("/set-preferences")
async def set_user_preferences(language: str = "en", difficulty: str = "beginner"):
    """Set the user's language and difficulty preferences"""
    try:
        await rag_service.set_user_preferences(language=language, difficulty=difficulty)
        return {
            "message": "Preferences updated successfully",
            "language": language,
            "difficulty": difficulty
        }
    except Exception as e:
        logging.error(f"Setting preferences error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Setting preferences failed: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "RAG Service",
        "features": ["multilingual", "difficulty_levels", "context_retrieval"]
    }


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "RAG Service for Physical AI & Robotics Textbook",
        "endpoints": ["/answer", "/set-preferences", "/health"],
        "features": {
            "languages": ["en", "ur"],
            "difficulty_levels": ["beginner", "advanced"],
            "capabilities": ["context_retrieval", "multilingual_generation"]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)