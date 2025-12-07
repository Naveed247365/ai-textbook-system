# Environment Variables Configuration

This document explains all the environment variables required for the AI Robotics Textbook System.

## Backend Environment Variables

### Database Configuration
- `QDRANT_URL`: URL for connecting to Qdrant vector database (e.g., http://localhost:6333)
- `QDRANT_HOST`: Host address for Qdrant (e.g., localhost)
- `QDRANT_PORT`: Port number for Qdrant (e.g., 6333)
- `QDRANT_API_KEY`: API key for Qdrant cloud instances (optional for local)

### AI/LLM Services
- `GEMINI_API_KEY`: Your Google Gemini API key for AI functionality
  - Get from: Google Cloud Console → APIs & Services → Credentials
- `OPENAI_API_KEY`: Your OpenAI API key if using OpenAI services (optional)

### Authentication
- `SECRET_KEY`: Secret key for JWT token encryption (32+ random characters)
- `ALGORITHM`: JWT algorithm (usually HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiry time in minutes

### Database Settings
- `DATABASE_URL`: Connection string for PostgreSQL database (if used)

### Application Settings
- `DEBUG`: Boolean, set to true for development, false for production
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARNING, ERROR)

## Frontend Environment Variables

### API Configuration
- `REACT_APP_BACKEND_API_URL`: Base URL for backend API calls
- `BACKEND_API_URL`: Alternative variable for backend URL

### AI Services
- `REACT_APP_GEMINI_BROWSER_API_KEY`: Browser-compatible Gemini API key (if needed)

### Application Settings
- `REACT_APP_DEBUG_MODE`: Enable debug mode in frontend
- `NODE_ENV`: Environment type (development, production)

## How to Get Required Keys

### Google Gemini API Key:
1. Go to Google AI Studio: https://aistudio.google.com/
2. Click "Get API Key" or go to "API Keys" section
3. Create a new API key or use an existing one
4. Copy the key and paste it as GEMINI_API_KEY

### Qdrant URL:
For local development: 
- Set QDRANT_URL=http://localhost:6333
- QDRANT_HOST=localhost
- QDRANT_PORT=6333

For Qdrant Cloud:
- Sign up at https://cloud.qdrant.io/
- Create a cluster
- Get the URL from the dashboard
- Get the API key from the dashboard

### Secret Key Generation:
Use a secure random string generator or this command:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Security Notes

⚠️ **IMPORTANT SECURITY NOTES:**
- Never commit .env files to version control
- Change the default SECRET_KEY immediately
- Use strong, unique passwords for all services
- Rotate API keys periodically
- Use HTTPS for production deployments