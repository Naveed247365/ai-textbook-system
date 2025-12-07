from qdrant_client import QdrantClient, models
import os

def get_qdrant_client() -> QdrantClient:
    """Initializes and returns a Qdrant client."""
    # Check environment variables for cloud configuration
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_host = os.getenv("QDRANT_HOST", "localhost")
    qdrant_port = os.getenv("QDRANT_PORT", "6333")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    # Use cloud instance if URL and API key are provided
    if qdrant_url and qdrant_api_key:
        client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
        )
    else:
        # Use local instance
        client = QdrantClient(
            host=qdrant_host,
            port=int(qdrant_port)
        )

    return client

def create_qdrant_collection(client: QdrantClient, collection_name: str, vector_size: int = 768, distance: models.Distance = models.Distance.COSINE) -> None:
    """Creates a Qdrant collection with optimized layout."""
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(size=vector_size, distance=distance),
    )
    print(f"Collection '{collection_name}' created with vector size {vector_size} and distance {distance}.")
