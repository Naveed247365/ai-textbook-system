from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from src.rag_service import RAGService

router = APIRouter()

# Initialize RAG service
rag_service = RAGService()

class QueryRequest(BaseModel):
    query: str
    target_language: str = "en"  # Default to English
    difficulty_level: str = "beginner"  # Default to beginner
    top_k: int = 5  # Number of context items to retrieve


class QueryResponse(BaseModel):
    query: str
    response: str
    source_language: str
    target_language: str
    difficulty_level: str
    context_used: List[str]
    retrieved_context_count: int


@router.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    """Query the RAG system with language and difficulty considerations"""
    try:
        # Set user preferences
        await rag_service.set_user_preferences(
            language=request.target_language,
            difficulty=request.difficulty_level
        )
        
        # Get answer from RAG service
        result = await rag_service.answer_query(
            query=request.query,
            target_language=request.target_language,
            difficulty=request.difficulty_level,
            top_k=request.top_k
        )
        
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@router.post("/set-preferences")
async def set_preferences(language: str = "en", difficulty: str = "beginner"):
    """Set the user's language and difficulty preferences"""
    try:
        await rag_service.set_user_preferences(language=language, difficulty=difficulty)
        return {
            "message": "Preferences updated successfully",
            "language": language,
            "difficulty": difficulty
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Setting preferences failed: {str(e)}")