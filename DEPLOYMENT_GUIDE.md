# Deployment Guide: Physical AI & Humanoid Robotics Textbook System

## Overview
This guide provides comprehensive instructions for deploying the Physical AI & Humanoid Robotics Textbook System, which includes a Docusaurus frontend and FastAPI backend with multilingual support and AI-powered features.

## System Architecture

### Frontend (Docusaurus)
- **Framework**: Docusaurus v3
- **Language Support**: English and Urdu with RTL support
- **Deployment**: Static site generation
- **Features**: AI-powered quizzes, lab exercises, code explanation

### Backend (FastAPI)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with asyncpg
- **Vector Database**: Qdrant for RAG functionality
- **AI Services**: Google Generative AI integration
- **Authentication**: JWT-based with user registration/login

### Infrastructure Components
- **API Gateway**: Handles requests to backend services
- **Vector Database**: Qdrant for content retrieval
- **Translation Cache**: PostgreSQL for translation caching
- **AI Service Integration**: Google Generative AI API

## Prerequisites

### System Requirements
- **Operating System**: Linux, macOS, or Windows with WSL2
- **CPU**: Minimum 4 cores (recommended 8+ cores for AI workloads)
- **RAM**: Minimum 8GB (recommended 16GB+ for optimal performance)
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection for AI services

### Software Dependencies
- **Docker**: Version 20.10+ (for containerization)
- **Docker Compose**: Version 2.0+ (for orchestration)
- **Node.js**: Version 18+ (for frontend build)
- **Python**: Version 3.10+ (for backend)
- **Poetry**: Python dependency management

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/physical-ai/humanoid-robotics-textbook.git
cd humanoid-robotics-textbook
```

### 2. Set up Backend Environment
```bash
cd backend

# Install Poetry if not already installed
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Create environment file
cp .env .env.production

# Edit the .env.production file with your configuration
nano .env.production
```

### 3. Set up Frontend Environment
```bash
cd frontend

# Install Node.js dependencies
npm install

# Create environment file
cp .env .env.production

# Edit the .env.production file with your configuration
nano .env.production
```

## Environment Variables

### Backend (.env)
```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/textbook_db
QDRANT_URL=http://localhost:6333

# AI Service Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-pro

# JWT Configuration
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Translation Cache
TRANSLATION_CACHE_TTL=86400  # 24 hours in seconds

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
# Backend API Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_API_VERSION=v1

# Google Analytics (Optional)
REACT_APP_GA_ID=UA-XXXXX-Y

# Feature Flags
REACT_APP_ENABLE_QUIZZES=true
REACT_APP_ENABLE_LABS=true
REACT_APP_ENABLE_TRANSLATION=true
```

## Docker Configuration

### 1. Create Docker Compose File
Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    container_name: textbook_postgres
    environment:
      POSTGRES_DB: textbook_db
      POSTGRES_USER: textbook_user
      POSTGRES_PASSWORD: textbook_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U textbook_user -d textbook_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Qdrant Vector Database
  qdrant:
    image: qdrant/qdrant:latest
    container_name: textbook_qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:6333/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: textbook_backend
    depends_on:
      postgres:
        condition: service_healthy
      qdrant:
        condition: service_healthy
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://textbook_user:textbook_password@postgres:5432/textbook_db
      - QDRANT_URL=http://qdrant:6333
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    env_file:
      - ./backend/.env.production

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: textbook_frontend
    depends_on:
      - backend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8000

volumes:
  postgres_data:
  qdrant_data:
```

### 2. Backend Dockerfile
Create `backend/Dockerfile`:

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy project files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --only=main

# Copy application code
COPY src ./src
COPY tests ./tests

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3. Frontend Dockerfile
Create `frontend/Dockerfile`:

```Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Docusaurus site
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built site to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Database Setup

### 1. Initialize PostgreSQL
The application will automatically create required tables on startup. Ensure your PostgreSQL instance is running and accessible.

### 2. Initialize Qdrant
The application will automatically create required collections in Qdrant on first use.

### 3. Migration Scripts
Database migrations are handled automatically by the application on startup.

## Content Ingestion

### 1. Prepare Content
Ensure all chapter content is in the `docusaurus-chapters` directory with proper structure:

```
docusaurus-chapters/
├── part1-introduction-ai-robotics/
│   ├── chapter1-foundations-physical-ai/
│   │   ├── 1-foundations-physical-ai.md
│   │   ├── 1-foundations-physical-ai.en.beginner.md
│   │   ├── 1-foundations-physical-ai.en.advanced.md
│   │   ├── 1-foundations-physical-ai.ur.beginner.md
│   │   └── 1-foundations-physical-ai.ur.advanced.md
│   └── ...
└── ...
```

### 2. Ingest Content
Use the backend API to ingest content into Qdrant:

```bash
# Ingest all chapters
curl -X POST http://localhost:8000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_dir": "./docusaurus-chapters",
    "collection_name": "textbook_chapters"
  }'
```

## Deployment Process

### 1. Production Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.yml up -d --build

# Verify all services are running
docker-compose ps
```

### 2. Health Checks
Verify system health after deployment:

```bash
# Backend health check
curl http://localhost:8000/health

# Frontend accessibility
curl http://localhost:3000

# API endpoints
curl http://localhost:8000/api/
```

### 3. Content Verification
Verify that content is properly ingested and accessible:

```bash
# Test content query
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query_text": "What is computer vision?", "collection_name": "textbook_chapters"}'
```

## Configuration Options

### Performance Tuning
- **Qdrant**: Adjust vector dimensions and indexing parameters based on content size
- **Database**: Configure connection pooling and query optimization
- **AI Services**: Set appropriate rate limits and caching strategies

### Security Configuration
- **HTTPS**: Enable SSL/TLS for production deployments
- **Authentication**: Configure JWT token expiration and refresh policies
- **Rate Limiting**: Implement API rate limiting to prevent abuse

### Monitoring
- **Logging**: Configure structured logging for debugging
- **Metrics**: Set up monitoring for API response times and error rates
- **Alerts**: Configure alerts for system health and performance metrics

## Scaling Considerations

### Horizontal Scaling
- **Backend**: Deploy multiple backend instances behind a load balancer
- **Database**: Consider read replicas for database scaling
- **AI Services**: Implement caching to reduce API calls

### Vertical Scaling
- **Memory**: Increase memory allocation for AI model processing
- **CPU**: Add more CPU cores for concurrent request handling
- **Storage**: Expand storage for vector database and content

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running and accessible
   - Check connection string format in environment variables
   - Ensure proper network connectivity between services

2. **Qdrant Connection Issues**
   - Verify Qdrant service is running
   - Check Qdrant URL configuration
   - Ensure proper network connectivity

3. **AI Service Issues**
   - Verify GEMINI_API_KEY is correctly set
   - Check API rate limits and quotas
   - Ensure proper internet connectivity

4. **Frontend Build Issues**
   - Verify Node.js version compatibility
   - Check dependency installation
   - Ensure proper environment variables

### Debugging Commands
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
docker-compose logs qdrant

# Check container status
docker-compose ps

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec postgres psql -U textbook_user -d textbook_db
```

## Maintenance

### Backup Strategy
- **Database**: Regular PostgreSQL backups
- **Content**: Version control for chapter content
- **Configuration**: Backup environment files

### Updates
- **Backend**: Update dependencies through Poetry
- **Frontend**: Update dependencies through npm
- **Infrastructure**: Regular Docker image updates

## Monitoring and Observability

### Logging
- **Application Logs**: Structured JSON logs for debugging
- **Access Logs**: Request/response logging for analytics
- **Error Logs**: Detailed error information for troubleshooting

### Metrics
- **API Performance**: Response times and throughput
- **Database Performance**: Query times and connection pools
- **AI Service Usage**: API call counts and costs

### Health Checks
- **Service Health**: Regular health check endpoints
- **Dependency Health**: Database and external service checks
- **Content Health**: Verify content accessibility

## Security Best Practices

### API Security
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Input Validation**: Sanitize all user inputs

### Data Security
- **Encryption**: Encrypt data in transit and at rest
- **Access Control**: Limit database access to authorized services
- **Audit Logging**: Track user actions and system changes

### AI Service Security
- **API Key Management**: Secure storage of API keys
- **Rate Limiting**: Prevent API abuse
- **Content Filtering**: Filter sensitive content

## Cost Optimization

### Infrastructure Costs
- **Compute**: Right-size instances based on usage patterns
- **Storage**: Optimize storage costs for content and databases
- **Network**: Minimize data transfer costs

### AI Service Costs
- **API Usage**: Monitor and optimize AI service usage
- **Caching**: Implement caching to reduce API calls
- **Batch Processing**: Use batch operations where possible

## Conclusion

This deployment guide provides comprehensive instructions for deploying the Physical AI & Humanoid Robotics Textbook System. The system is designed to be scalable, secure, and maintainable. Follow the steps carefully and customize the configuration based on your specific requirements.

For support or questions, refer to the project documentation or contact the development team.