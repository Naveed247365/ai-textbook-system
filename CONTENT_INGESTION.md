# Content Ingestion Guide

This document explains how to ingest the textbook content into the Qdrant vector database after deploying the backend.

## Overview

The Physical AI & Humanoid Robotics Textbook contains comprehensive content across 6 parts and multiple chapters. The content is available in multiple languages (English/Urdu) and difficulty levels (beginner/advanced). This content needs to be ingested into the Qdrant vector database for the RAG (Retrieval-Augmented Generation) functionality to work.

## Content Structure

### Directory Structure
```
docusaurus-chapters/
├── part1-introduction-ai-robotics/
│   └── chapter1-foundations-physical-ai/
│       ├── 1-foundations-physical-ai.md
│       ├── 1-foundations-physical-ai.en.beginner.md
│       ├── 1-foundations-physical-ai.en.advanced.md
│       ├── 1-foundations-physical-ai.ur.beginner.md
│       └── 1-foundations-physical-ai.ur.advanced.md
├── part2-core-technologies/
│   ├── chapter3-sensors-actuators/
│   │   ├── 3-sensors-actuators.md
│   │   ├── 3-sensors-actuators.en.beginner.md
│   │   ├── 3-sensors-actuators.en.advanced.md
│   │   ├── 3-sensors-actuators.ur.beginner.md
│   │   └── 3-sensors-actuators.ur.advanced.md
│   └── ...
└── ...
```

### Content Coverage

The textbook covers these main areas:

1. **Part 1: Introduction to AI & Robotics**
   - Foundations of Physical AI & Robotics
   - Humanoid Robotics
   - Historical Context
   - Current Applications
   - Future Prospects

2. **Part 2: Core Technologies**
   - Sensors & Actuators
   - ROS2 Essentials
   - Simulation Environments

3. **Part 3: Perception & Intelligence**
   - Perception & Vision
   - Vision-Language-Action (VLA) Models
   - Machine Learning for Robotics

4. **Part 4: Advanced Topics**
   - Deep Learning Architectures
   - Reinforcement Learning Principles
   - AI Agents for Robotics

5. **Part 5: Implementation & Deployment**
   - Humanoid Robotics (Design & Control)
   - Jetson Edge Deployment
   - Ethics and Future of AI

6. **Part 6: Practical Applications**
   - Hands-on Labs
   - Quizzes & Assessments
   - Specialized Systems (Urdu Translation Layer, Personalization)

## Ingestion Process

### Prerequisites

Before ingesting content, ensure:

1. Backend is deployed and running
2. Qdrant vector database is connected and accessible
3. API keys are properly configured
4. Required dependencies are installed

### API Endpoint

Content ingestion is performed via the `/api/ingest` endpoint:

```
POST /api/ingest
```

### Request Format

```json
{
  "chapter_dir": "./docusaurus-chapters",
  "collection_name": "textbook_chapters",
  "language_filter": ["en", "ur"],  // Optional: specify languages to ingest
  "difficulty_filter": ["beginner", "advanced"],  // Optional: specify difficulty levels
  "chunk_size": 512,  // Optional: size of text chunks for vectorization
  "overlap": 50  // Optional: overlap between chunks
}
```

## Step-by-Step Ingestion

### Step 1: Verify Backend Health

```bash
curl -X GET https://your-backend-url/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": ["Translation Service", "RAG Service"]
}
```

### Step 2: Check Qdrant Connection

```bash
curl -X GET https://your-backend-url/api/query/health
```

### Step 3: Perform Content Ingestion

#### Option 1: Ingest All Content
```bash
curl -X POST https://your-backend-url/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_dir": "./docusaurus-chapters",
    "collection_name": "textbook_chapters"
  }'
```

#### Option 2: Ingest Specific Language
```bash
curl -X POST https://your-backend-url/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_dir": "./docusaurus-chapters",
    "collection_name": "textbook_chapters",
    "language_filter": ["en"]
  }'
```

#### Option 3: Ingest Specific Difficulty
```bash
curl -X POST https://your-backend-url/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_dir": "./docusaurus-chapters",
    "collection_name": "textbook_chapters",
    "difficulty_filter": ["beginner"]
  }'
```

### Step 4: Monitor Ingestion Progress

The ingestion process returns progress information:

```json
{
  "status": "ingestion_complete",
  "total_files_processed": 150,
  "total_chunks_created": 1245,
  "collection_name": "textbook_chapters",
  "processing_time": "5.2 minutes",
  "average_chunk_size": 512
}
```

## Ingestion Script

Create an ingestion script for automated processing:

```bash
#!/bin/bash
# ingest-content.sh - Script to ingest textbook content

BACKEND_URL="https://your-backend-url.railway.app"
COLLECTION_NAME="textbook_chapters"

echo "Starting content ingestion..."
echo "Backend URL: $BACKEND_URL"
echo "Collection: $COLLECTION_NAME"
echo

# Verify backend is accessible
echo "1. Checking backend health..."
HEALTH=$(curl -s "$BACKEND_URL/health" | grep -o '"status":"healthy"')
if [ -z "$HEALTH" ]; then
  echo "✗ Backend is not healthy. Please check your deployment."
  exit 1
else
  echo "✓ Backend is healthy"
fi

# Start ingestion
echo
echo "2. Starting content ingestion..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\nTIME:%{time_total}\n" -X POST "$BACKEND_URL/api/ingest" \
  -H "Content-Type: application/json" \
  -d "{
    \"chapter_dir\": \"./docusaurus-chapters\",
    \"collection_name\": \"$COLLECTION_NAME\"
  }")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✓ Content ingestion completed successfully"
  echo "$RESPONSE" | head -n -3
else
  echo "✗ Content ingestion failed with status: $HTTP_STATUS"
  echo "$RESPONSE"
  exit 1
fi

# Verify content was ingested
echo
echo "3. Verifying content ingestion..."
COUNT=$(curl -s -X POST "$BACKEND_URL/api/query" \
  -H "Content-Type: application/json" \
  -d "{
    \"query_text\": \"test\",
    \"collection_name\": \"$COLLECTION_NAME\",
    \"limit\": 1
  }" | grep -o '"total_results":[0-9]*' | cut -d: -f2)

if [ "$COUNT" -gt 0 ]; then
  echo "✓ Content verification successful - found $COUNT results"
else
  echo "✗ Content verification failed - no results found"
fi

echo
echo "Content ingestion process completed!"
echo "Your textbook content is now available in the vector database."
```

## Content Verification

After ingestion, verify that content is properly stored:

### 1. Query Test
```bash
curl -X POST https://your-backend-url/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query_text": "What is computer vision?",
    "collection_name": "textbook_chapters",
    "limit": 5
  }'
```

### 2. Count Verification
```bash
curl -X POST https://your-backend-url/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query_text": "all",
    "collection_name": "textbook_chapters",
    "limit": 1
  }'
```

## Performance Considerations

### Chunking Strategy
- **Default chunk size**: 512 tokens
- **Overlap**: 50 tokens
- **Optimization**: Adjust based on content complexity and query patterns

### Vector Database Optimization
- **Indexing**: Qdrant automatically creates indexes
- **Similarity**: Uses cosine similarity by default
- **Performance**: Monitor query response times

### Memory Usage
- Large content sets may require significant memory
- Consider processing in batches for very large datasets

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify backend URL is correct
   - Check Qdrant connection settings
   - Ensure API keys are properly configured

2. **Timeout Errors**
   - Large content sets may take time to process
   - Consider increasing timeout values
   - Process content in smaller batches

3. **Memory Errors**
   - Very large files may cause memory issues
   - Split large content files
   - Increase memory allocation if possible

4. **Format Errors**
   - Verify content files are in correct format
   - Check for encoding issues
   - Ensure proper file structure

### Error Responses

```json
{
  "detail": "Error description",
  "error_code": "ERROR_CODE",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

## Monitoring and Analytics

### Ingestion Metrics
- Number of files processed
- Total content chunks created
- Processing time per file
- Vector database storage usage

### Query Performance
- Average response time
- Success rate of queries
- Most frequently accessed content

## Content Updates

### Adding New Content
1. Add new content files to `docusaurus-chapters/`
2. Run ingestion again (it will add new content)
3. Verify new content is accessible

### Updating Existing Content
1. Update content files
2. Re-run ingestion (it will update existing entries)
3. Verify changes are reflected

## Security Considerations

### Content Validation
- All content is validated before ingestion
- Malicious content is filtered
- Proper encoding is enforced

### Access Control
- Ingestion API may require authentication
- Monitor who can trigger ingestion
- Log all ingestion activities

## Next Steps

1. Deploy backend to Railway with proper configuration
2. Set up Qdrant vector database
3. Run content ingestion using the API
4. Verify content is accessible via query API
5. Test RAG functionality with real queries
6. Monitor performance and optimize as needed

## Expected Outcomes

After successful content ingestion:
- All textbook content is stored in Qdrant vector database
- Content is searchable using semantic queries
- RAG functionality provides relevant results
- Multi-language content is properly indexed
- Difficulty levels are maintained
- Content can be retrieved for AI-powered features