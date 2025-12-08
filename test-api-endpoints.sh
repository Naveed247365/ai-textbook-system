#!/bin/bash
# test-api-endpoints.sh - Script to test API endpoints after deployment

echo "==========================================="
echo "API Endpoints Testing Script"
echo "==========================================="

if [ -z "$1" ]; then
    echo "Usage: $0 <backend_url>"
    echo "Example: $0 https://your-app.railway.app"
    exit 1
fi

BACKEND_URL=$1

echo "Testing backend at: $BACKEND_URL"
echo

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" -o /dev/null \
  "$BACKEND_URL/health"
echo

# Test 2: Root Endpoint
echo "2. Testing Root Endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  -H "Content-Type: application/json" \
  "$BACKEND_URL/"
echo

# Test 3: Translation Endpoint (without actual API key, should return error)
echo "3. Testing Translation Endpoint (expected to fail without API key)..."
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "source_language": "en", "target_language": "ur", "difficulty_level": "beginner"}' \
  "$BACKEND_URL/api/translate"
echo

# Test 4: Check available endpoints
echo "4. Checking available API routes..."
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  -H "Content-Type: application/json" \
  "$BACKEND_URL/openapi.json" | jq -r '.info.title' 2>/dev/null || echo "Could not parse OpenAPI info"
echo

echo "==========================================="
echo "Basic API Tests Completed"
echo "==========================================="
echo
echo "Next steps for full testing:"
echo "1. Set up proper API keys in Railway"
echo "2. Test translation with valid API key"
echo "3. Test content ingestion using /api/ingest"
echo "4. Test RAG queries using /api/query"
echo "5. Test authentication endpoints"
echo "6. Test quiz and lab generation endpoints"