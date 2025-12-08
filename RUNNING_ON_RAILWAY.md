# Running on Railway

This document provides instructions for deploying the Physical AI & Humanoid Robotics Textbook backend to Railway.

## Prerequisites

1. **Railway Account**: Create an account at [Railway.app](https://railway.app)
2. **Railway CLI**: Install the Railway CLI (optional but recommended)
3. **API Keys**: Prepare the following API keys:
   - Google Gemini API Key
   - Qdrant Cloud credentials (if using cloud version)
   - PostgreSQL connection string (for translation cache)

## Deployment Steps

### Option 1: Using Railway Dashboard (Recommended)

1. **Fork the Repository**
   - Fork this repository to your GitHub account

2. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your forked repository

3. **Configure Variables**
   - Add the following environment variables in the Railway dashboard:

   ```
   GEMINI_API_KEY=your_actual_gemini_api_key
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   DATABASE_URL=your_postgresql_connection_string
   SECRET_KEY=your_secure_secret_key
   ```

4. **Deploy**
   - Click "Deploy" in the Railway dashboard
   - Monitor the deployment logs for any errors

### Option 2: Using Railway CLI

1. **Install Railway CLI**
   ```bash
   # For Linux/macOS
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. **Login and Link Project**
   ```bash
   railway login
   railway link
   ```

3. **Deploy**
   ```bash
   railway up
   ```

## Required Environment Variables

Set these variables in your Railway project settings:

### AI Services
- `GEMINI_API_KEY`: Your Google Gemini API key
- `GEMINI_MODEL_NAME`: Gemini model to use (default: gemini-pro)

### Database Services
- `DATABASE_URL`: PostgreSQL connection string for translation cache
- `QDRANT_URL`: Qdrant vector database URL
- `QDRANT_API_KEY`: Qdrant API key (if using cloud version)

### Security
- `SECRET_KEY`: JWT secret key (generate a strong random key)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 30)

### Application Settings
- `DEBUG`: Set to "false" for production
- `LOG_LEVEL`: Log level (default: INFO)

## Database Setup

### PostgreSQL (Translation Cache)
The application will automatically create required tables on startup. The translation cache stores:
- Translated content to reduce API calls
- User preferences
- Quiz and lab results

### Qdrant (Vector Database)
The application will automatically create collections for:
- Textbook content embeddings
- Chapter metadata
- Semantic search indexes

## Content Ingestion

After deployment, you'll need to ingest the textbook content:

1. **Upload Content Files**
   - The content files are already in the `docusaurus-chapters/` directory
   - They're organized by language, difficulty, and chapter

2. **Run Ingestion**
   - Use the `/api/ingest` endpoint to upload content to Qdrant
   - Example:
   ```bash
   curl -X POST https://your-app.railway.app/api/ingest \
     -H "Content-Type: application/json" \
     -d '{
       "chapter_dir": "./docusaurus-chapters",
       "collection_name": "textbook_chapters"
     }'
   ```

## Testing the Deployment

### Health Check
```bash
curl https://your-app.railway.app/health
```

### Translation Service
```bash
curl -X POST https://your-app.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "source_language": "en",
    "target_language": "ur",
    "difficulty_level": "beginner"
  }'
```

### Content Query
```bash
curl -X POST https://your-app.railway.app/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query_text": "What is computer vision?",
    "collection_name": "textbook_chapters"
  }'
```

## Frontend Integration

The frontend (Docusaurus) should be configured to point to your backend API:

1. Update the frontend environment variables:
   - `REACT_APP_BACKEND_URL`: Your Railway backend URL

2. Deploy the frontend separately (e.g., to Vercel, Netlify, or GitHub Pages)

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are properly installed during build
2. **Database Connection**: Verify your DATABASE_URL is correctly formatted
3. **Qdrant Connection**: Check QDRANT_URL and QDRANT_API_KEY
4. **API Key Issues**: Ensure GEMINI_API_KEY is valid and has proper permissions

### Build Logs
Check the Railway build logs for any dependency installation issues.

### Runtime Logs
Monitor runtime logs for application errors after deployment.

## Scaling Considerations

- **Database**: Consider upgrading to a paid PostgreSQL plan for production
- **Qdrant**: Choose appropriate plan based on content size and query volume
- **Compute**: Monitor resource usage and scale up if needed
- **Caching**: Translation cache reduces API costs significantly

## Security Best Practices

- Rotate API keys regularly
- Use strong SECRET_KEY values
- Enable HTTPS (enabled by default on Railway)
- Monitor API usage for unusual patterns

## Monitoring

- Set up alerts for deployment failures
- Monitor API response times
- Track error rates
- Watch resource utilization

## Rollback Process

If issues occur after deployment:
1. Use Railway's deployment history to rollback to a previous version
2. Or redeploy with fixed code

## Next Steps

1. Deploy the backend to Railway
2. Configure environment variables
3. Ingest textbook content
4. Deploy the frontend
5. Test all functionality
6. Monitor performance and usage