from qdrant_client import QdrantClient

# Test the Qdrant connection with your cloud instance
qdrant_client = QdrantClient(
    url="https://56f0dcd5-e9d3-4eb5-b669-c7f62d285f0d.europe-west3-0.gcp.cloud.qdrant.io:6333", 
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.pUb7XR2QIA5bWzkVNl_NuQrWS3RcZ_4Pi7qmFRk0xzo",
)

print("Connected to Qdrant Cloud!")
collections = qdrant_client.get_collections()
print(collections)