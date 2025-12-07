import sys
import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging

# Add the project root directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Initialize services at startup
from src.translation_service import translation_cache, translation_service
from src.rag_service import RAGService

# Import auth utilities to ensure JWT dependencies are available
from src.auth_utils import SECRET_KEY, ALGORITHM

rag_service = RAGService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("Initializing backend services...")
    await translation_cache.initialize_db()
    logging.info("Backend services initialized")
    yield
    # Shutdown
    logging.info("Shutting down backend services...")
    if translation_cache.connection_pool:
        await translation_cache.connection_pool.close()


app = FastAPI(
    title="Physical AI & Humanoid Robotics Textbook Backend",
    description="Backend services for multilingual and multi-difficulty textbook platform",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
async def read_root():
    return {
        "message": "Welcome to the Physical AI & Humanoid Robotics Textbook Backend!",
        "services": [
            {"name": "Translation Service", "path": "/translation/docs"},
            {"name": "RAG Service", "path": "/rag/docs"}
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": ["Translation Service", "RAG Service"]
    }

# Import and include API routers
from src.api.translation import router as translation_router
from src.api.query import router as query_router
from src.api.auth import router as auth_router
from src.api.profile import router as profile_router
from src.api.quiz import router as quiz_router
from src.api.labs import router as labs_router
from src.api.ingestion import router as ingestion_router

app.include_router(translation_router, prefix="/api", tags=["translation"])
app.include_router(query_router, prefix="/api", tags=["query"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(profile_router, prefix="/api", tags=["profile"])
app.include_router(quiz_router, prefix="/api", tags=["quiz"])
app.include_router(labs_router, prefix="/api", tags=["labs"])
app.include_router(ingestion_router, prefix="/api", tags=["ingestion"])