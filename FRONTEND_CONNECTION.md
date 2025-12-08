# Frontend to Backend Connection Guide

This document explains how to connect the Docusaurus frontend to the deployed backend API.

## Environment Configuration

### Frontend Environment Variables

Update the frontend `.env.production` file with:

```env
# Backend API Configuration
REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
REACT_APP_API_VERSION=v1

# Feature Flags
REACT_APP_ENABLE_QUIZZES=true
REACT_APP_ENABLE_LABS=true
REACT_APP_ENABLE_TRANSLATION=true
REACT_APP_ENABLE_RAG=true

# Google Analytics (Optional)
REACT_APP_GA_ID=your_ga_id
```

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Fork the Repository**
   - Fork the frontend repository to your GitHub account

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

3. **Set Environment Variables**
   - In the Vercel dashboard, add the environment variables listed above

4. **Deploy**
   - Vercel will automatically build and deploy your frontend

### Option 2: Deploy to Netlify

1. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site"
   - Connect to your GitHub repository

2. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the required environment variables

3. **Deploy**
   - Netlify will build and deploy your frontend

### Option 3: Deploy to GitHub Pages

1. **Update package.json**
   ```json
   {
     "homepage": "https://your-username.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

## API Integration Points

### 1. Authentication
- Login/Registration: `POST /api/auth/token`
- User Profile: `GET /api/profile/me`

### 2. Content Access
- Chapter Navigation: Static content from Docusaurus
- Dynamic Content: `POST /api/query` for RAG-based content

### 3. Translation Service
- Text Translation: `POST /api/translate`
- Language Toggle: Update UI to use different content files

### 4. Interactive Features
- Quiz Generation: `POST /api/quiz/generate`
- Quiz Submission: `POST /api/quiz/submit`
- Lab Exercises: `POST /api/labs/generate`

### 5. Content Ingestion
- Chapter Upload: `POST /api/ingest`

## Frontend Code Modifications

### API Service Configuration

Create or update `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
    this.version = API_VERSION;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(credentials) {
    return this.request('auth/token', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Translation
  async translate(text, sourceLang = 'en', targetLang = 'ur', difficulty = 'beginner') {
    return this.request('translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        source_language: sourceLang,
        target_language: targetLang,
        difficulty_level: difficulty,
      }),
    });
  }

  // Content Query
  async query(content) {
    return this.request('query', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  // Quiz Generation
  async generateQuiz(params) {
    return this.request('quiz/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export default new ApiService();
```

### Language Switching Component

Create a language switcher component:

```jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [availableLangs] = useState([
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'اردو' }
  ]);

  const switchLanguage = async (langCode) => {
    try {
      // Update UI language
      setCurrentLang(langCode);

      // Store preference
      localStorage.setItem('preferred_language', langCode);

      // Optionally, update user profile with language preference
      // await ApiService.updateUserLanguage(langCode);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <div className="language-switcher">
      {availableLangs.map((lang) => (
        <button
          key={lang.code}
          className={currentLang === lang.code ? 'active' : ''}
          onClick={() => switchLanguage(lang.code)}
          disabled={currentLang === lang.code}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
```

## Testing Frontend Connection

### 1. Health Check
```bash
curl https://your-frontend-url.com/api-test
# Should return data from your backend
```

### 2. API Endpoint Tests
- Test translation functionality
- Test content querying
- Test authentication flow
- Test quiz/lab generation

## Security Considerations

1. **CORS Configuration**
   - Backend should allow requests from your frontend domain
   - Check `backend/src/main.py` for CORS settings

2. **API Key Security**
   - Never expose backend API keys in frontend code
   - All external API calls should go through your backend

3. **Authentication**
   - Implement proper JWT token handling
   - Secure token storage (prefer httpOnly cookies for production)

## Performance Optimization

1. **Caching**
   - Implement frontend caching for API responses
   - Use service workers for offline functionality

2. **CDN**
   - Serve static assets from CDN
   - Optimize images and other media

3. **Bundle Size**
   - Code splitting for better loading performance
   - Tree shaking to reduce bundle size

## Monitoring and Analytics

1. **API Performance**
   - Monitor API response times
   - Track error rates

2. **User Analytics**
   - Page views and engagement
   - Feature usage statistics

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend domain is allowed

2. **API Connection Issues**
   - Verify backend URL is correct
   - Check if backend is running and accessible

3. **Authentication Problems**
   - Verify JWT token handling
   - Check token expiration and refresh logic

### Debugging Tools

1. **Browser Developer Tools**
   - Network tab for API calls
   - Console for error messages

2. **Backend Logs**
   - Check Railway logs for backend errors
   - Monitor API usage and performance

## Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Backend URL configured
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Translation service functional
- [ ] Content querying operational
- [ ] Quiz/Lab features working
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security measures in place