#!/bin/bash
# deploy-to-railway.sh - Script to help deploy the backend to Railway

echo "==========================================="
echo "Physical AI & Humanoid Robotics Textbook"
echo "Railway Deployment Helper"
echo "==========================================="

echo
echo "Before running this deployment, please ensure you have:"
echo "1. A Railway account (https://railway.app)"
echo "2. The Railway CLI installed (optional but recommended)"
echo "3. Your API keys ready (Google Gemini, Qdrant, PostgreSQL)"
echo

read -p "Do you want to proceed with the deployment setup? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo
echo "==========================================="
echo "Step 1: Environment Variables Setup"
echo "==========================================="

echo "You will need to set the following environment variables in Railway:"
echo
echo "Required API Keys:"
echo "- GEMINI_API_KEY: Your Google Gemini API key"
echo "- QDRANT_URL: Your Qdrant vector database URL"
echo "- DATABASE_URL: Your PostgreSQL connection string"
echo
echo "Security:"
echo "- SECRET_KEY: A strong, random secret key for JWT"
echo
echo "Optional (with defaults):"
echo "- GEMINI_MODEL_NAME: Gemini model name (default: gemini-pro)"
echo "- ALGORITHM: JWT algorithm (default: HS256)"
echo "- ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration (default: 30)"
echo "- DEBUG: Debug mode (default: false)"
echo "- LOG_LEVEL: Logging level (default: INFO)"

echo
echo "==========================================="
echo "Step 2: Deployment Methods"
echo "==========================================="

echo
echo "Method 1: Using Railway Dashboard (Recommended for first-time deployment)"
echo "  1. Fork this repository to your GitHub account"
echo "  2. Go to https://railway.app and click 'New Project'"
echo "  3. Select 'Deploy from GitHub' and choose your forked repository"
echo "  4. In the Environment Variables section, add the variables listed above"
echo "  5. Click 'Deploy' and monitor the logs"

echo
echo "Method 2: Using Railway CLI"
echo "  1. Install Railway CLI: curl -fsSL https://railway.app/install.sh | sh"
echo "  2. Login: railway login"
echo "  3. Link project: railway link"
echo "  4. Set variables: railway var set KEY=VALUE"
echo "  5. Deploy: railway up"

echo
echo "==========================================="
echo "Step 3: Post-Deployment Tasks"
echo "==========================================="

echo
echo "After successful deployment, you will need to:"
echo "1. Test the health endpoint: curl https://your-app.railway.app/health"
echo "2. Ingest content to Qdrant using the /api/ingest endpoint"
echo "3. Update frontend configuration to point to your backend"
echo "4. Test translation and query endpoints"

echo
echo "==========================================="
echo "Deployment Information"
echo "==========================================="

echo
echo "Project is configured with:"
echo "- Nixpacks build system (see railway.config.json)"
echo "- Poetry for dependency management"
echo "- FastAPI backend with async support"
echo "- PostgreSQL for translation caching"
echo "- Qdrant for vector database"
echo "- Google Generative AI integration"
echo "- Multi-language (English/Urdu) support"
echo "- Multi-difficulty (beginner/advanced) content"

echo
echo "Content files are located in the 'docusaurus-chapters/' directory"
echo "The API endpoints are documented in SYSTEM_ARCHITECTURE.md"

echo
echo "For support, refer to the RUNNING_ON_RAILWAY.md guide"
echo "or contact the development team."

echo
echo "Deployment setup complete!"
echo "Remember to secure your API keys and monitor your usage."