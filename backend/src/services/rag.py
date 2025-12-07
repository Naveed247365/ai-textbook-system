import sys
import os
# Add the project root directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from typing import List, Dict, Any, Optional
from fastapi import Depends

from src.services.embedding_pipeline import generate_embeddings
from src.services.qdrant_client import get_qdrant_client
from src.api.translation import get_translation # Import the placeholder translation function
from src.services.personalization import get_user_personalization_data, apply_personalization_to_chapter_content # Import personalization services
from src.api.auth import get_current_user # To get current user for personalization
from src.models.user import UserInDB
from src.agents.explain_agent import explain_code_snippet # Import the explain_agent

async def query_explain_code(
    code_snippet: str,
    context: str = "",
    current_user: UserInDB = Depends(get_current_user) # Inject current user if needed for personalization of explanation
) -> Dict[str, Any]:
    """Provides an explanation for a code snippet using the explain_agent."""
    # In a real application, you might use the current_user to fetch personalized explanation preferences
    explanation_result = explain_code_snippet(code_snippet, context)
    return explanation_result

async def query_rag(
    query_text: str,
    collection_name: str,
    top_k: int = 5,
    target_language: str = "en",
    current_user: UserInDB = Depends(get_current_user) # Inject current user for personalization
) -> List[Dict[str, Any]]:
    """Queries the RAG system and optionally translates and personalizes the results."""
    qdrant_client = get_qdrant_client()

    # Fetch personalization data for the current user
    personalization_data = get_user_personalization_data(current_user.username) # Assuming username is used as user_id

    # 1. Generate embedding for the query text
    query_embedding = generate_embeddings([query_text])[0]

    # 2. Search in Qdrant
    search_result = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=top_k,
        with_payload=True
    )

    results = []
    for hit in search_result:
        chunk_content = hit.payload.get("chunk_content", "")

        # Apply personalization to the original chunk content
        personalized_chunk_content = apply_personalization_to_chapter_content(chunk_content, personalization_data)

        # Optionally translate the personalized chunk content
        final_content = personalized_chunk_content
        if target_language != "en":
            final_content = get_translation(personalized_chunk_content, target_language)

        results.append({"score": hit.score, "payload": {**hit.payload, "processed_content": final_content}})

    return results
