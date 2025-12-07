from typing import List, Dict, Any, Optional
import asyncio
import logging
from qdrant_client import AsyncQdrantClient
from transformers import AutoTokenizer, AutoModel
import torch
import os
from .ai_adapters import translation_adapter_manager

class RAGService:
    """Retrieval-Augmented Generation service supporting multiple languages and difficulty levels"""

    def __init__(self):
        # Store Qdrant URL for lazy initialization to avoid startup issues
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        self._qdrant_url = qdrant_url
        self._qdrant_client = None  # Initialize lazily

        # Initialize embedding model
        try:
            self.tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
            self.model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        except Exception as e:
            logging.error(f"Failed to initialize embedding models: {e}")
            # In production, you might want to handle this differently
            raise

        # Language and difficulty settings
        self.current_language = "en"  # Default to English
        self.current_difficulty = "beginner"  # Default to beginner

        # Translation adapter
        self.translation_manager = translation_adapter_manager

    @property
    def qdrant_client(self):
        """Lazy initialization of Qdrant client to avoid startup issues"""
        if self._qdrant_client is None:
            from qdrant_client import AsyncQdrantClient
            self._qdrant_client = AsyncQdrantClient(url=self._qdrant_url)
        return self._qdrant_client
    
    async def set_user_preferences(self, language: str = "en", difficulty: str = "beginner"):
        """Set the current language and difficulty level for RAG responses"""
        self.current_language = language
        self.current_difficulty = difficulty
    
    async def get_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for a given text"""
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            # Use mean pooling to get sentence embedding
            embeddings = outputs.last_hidden_state.mean(dim=1).numpy()[0]
        return embeddings.tolist()
    
    async def retrieve_context(self, query: str, language: str = "en", difficulty: str = "beginner", top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant context from the knowledge base based on language and difficulty"""
        query_embedding = await self.get_embeddings(query)
        
        # Search in Qdrant with filters for language and difficulty
        search_results = await self.qdrant_client.search(
            collection_name="textbook_content",
            query_vector=query_embedding,
            query_filter=None,  # In a full implementation, we'd filter by language/difficulty
            limit=top_k
        )
        
        # Extract relevant content
        contexts = []
        for hit in search_results:
            context_item = {
                'content': hit.payload.get('content', ''),
                'title': hit.payload.get('title', ''),
                'section': hit.payload.get('section', ''),
                'difficulty_level': hit.payload.get('difficulty_level', 'beginner'),
                'language': hit.payload.get('language', 'en'),
                'similarity_score': hit.score
            }
            contexts.append(context_item)
        
        # Filter results based on difficulty if needed
        if difficulty == "beginner":
            # Prioritize beginner-level content
            contexts = [ctx for ctx in contexts if ctx['difficulty_level'] in ['beginner', 'all']]
        elif difficulty == "advanced":
            # Include advanced content
            contexts = [ctx for ctx in contexts if ctx['difficulty_level'] in ['advanced', 'all']]
        
        # Sort by similarity score (highest first)
        contexts.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return contexts
    
    async def generate_response(self, query: str, context: List[Dict[str, Any]], 
                               target_language: str = "en", difficulty: str = "beginner") -> str:
        """Generate response using the retrieved context, considering language and difficulty"""
        
        # Prepare the context for the LLM
        context_str = "\n\n".join([item['content'] for item in context])
        
        # Create the prompt based on difficulty level
        if difficulty == "beginner":
            prompt = f"""
            You are an AI assistant explaining concepts from a Physical AI & Robotics textbook.
            Provide a simple, easy-to-understand explanation based on the following context.
            Use simple language and clear examples.
            
            Query: {query}
            
            Context: {context_str}
            
            Answer:
            """
        else:  # advanced
            prompt = f"""
            You are an AI assistant providing detailed, technical explanations from a Physical AI & Robotics textbook.
            Provide a comprehensive, in-depth answer based on the following context.
            Include technical details, mathematical concepts, and advanced terminology where appropriate.
            
            Query: {query}
            
            Context: {context_str}
            
            Answer:
            """
        
        # In a real implementation, we'd call an LLM here
        # For now, we'll simulate the response
        if difficulty == "beginner":
            llm_response = f"[BEGINNER RESPONSE to: {query[:50]}...]"
        else:
            llm_response = f"[ADVANCED RESPONSE to: {query[:50]}...]"
        
        # Translate response if needed
        if target_language != "en":
            try:
                translated_response = await self.translation_manager.translate(
                    text=llm_response,
                    source_lang="en",
                    target_lang=target_language,
                    difficulty=difficulty,
                    service="gemini"
                )
                return translated_response
            except Exception as e:
                logging.error(f"Translation error: {str(e)}")
                return f"[TRANSLATION ERROR: {llm_response}]"
        
        return llm_response
    
    async def answer_query(self, query: str, target_language: str = "en", 
                          difficulty: str = "beginner", top_k: int = 5) -> Dict[str, Any]:
        """Main method to answer a query using RAG with language and difficulty consideration"""
        
        # Retrieve relevant context
        context = await self.retrieve_context(query, target_language, difficulty, top_k)
        
        # Generate response using the context
        response = await self.generate_response(query, context, target_language, difficulty)
        
        return {
            "query": query,
            "response": response,
            "source_language": "en",  # Assuming source content is in English
            "target_language": target_language,
            "difficulty_level": difficulty,
            "context_used": [ctx['title'] for ctx in context],
            "retrieved_context_count": len(context)
        }