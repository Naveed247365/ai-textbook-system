# Physical AI & Humanoid Robotics Textbook - Specification

## Overview

This specification defines the implementation of a bilingual support system and personalized learning levels for the Physical AI & Humanoid Robotics Textbook. The system will support English-Urdu toggling and beginner/advanced learning modes to provide an adaptive educational experience.

## Requirements

### Functional Requirements

#### F1: Urdu Translation System
- **F1.1** Default language shall be English
- **F1.2** System shall provide a language toggle button that appears at the top-right of every page and in the sidebar
- **F1.3** System shall translate content using AI models (Claude/Gemini/OpenAI)
- **F1.4** System shall cache translated content in Neon/Postgres database
- **F1.5** System shall render translated content instantly on subsequent requests
- **F1.6** RAG system shall respond in the selected language
- **F1.7** System shall support RTL (right-to-left) text direction for Urdu
- **F1.8** System shall use "Noto Nastaliq Urdu" font or appropriate fallback for Urdu text
- **F1.9** System shall store language metadata { language: "en" | "ur" } for all content

#### F2: Personalized Learning Levels
- **F2.1** System shall provide Beginner Mode with simplified explanations
- **F2.2** System shall provide Advanced Mode with deep technical content
- **F2.3** User shall select learning preference upon signup via Better-Auth
- **F2.4** System shall save user preference in Neon/Postgres
- **F2.5** RAG system shall adjust context based on selected difficulty level
- **F2.6** System shall support dual-version content files
- **F2.7** System shall provide UI toggle for difficulty level on each page
- **F2.8** Sub-agents shall generate difficulty-appropriate output

### Non-Functional Requirements

#### N1: Performance
- **N1.1** Translation caching shall ensure <200ms response time for previously translated content
- **N1.2** Language switching shall be instantaneous after initial load
- **N1.3** UI toggles shall respond within 100ms

#### N2: Usability
- **N2.1** Language toggle shall be visible on all pages
- **N2.2** Difficulty toggle shall be present on all content pages
- **N2.3** UI shall clearly indicate current language and difficulty settings

#### N3: Security
- **N3.1** User preferences shall be stored securely in Neon/Postgres
- **N3.2** Translation API calls shall use secure authentication

## Technical Architecture

### Frontend Components
- **LanguageToggle Component**: UI element for language switching
- **DifficultyToggle Component**: UI element for difficulty switching
- **LanguageContent Component**: Handles rendering of bilingual content
- **BilingualLayout Component**: Handles layout adjustments for RTL
- **PersonalizedContent Component**: Renders content based on difficulty level

### Backend Services
- **Translation Service**: AI-based content translation
- **Caching Service**: Content caching in Neon/Postgres
- **RAG Service**: Language and difficulty-aware response generation
- **User Profile Service**: Manages user preferences

### Database Schema
- **User Preferences Table**: Stores language and difficulty settings
- **Translated Content Cache Table**: Stores AI-translated content
- **Content Metadata Table**: Stores language and difficulty metadata for content

### API Endpoints
- **POST /api/translate**: Request AI translation for content
- **GET /api/user/preference**: Get user language and difficulty preferences
- **PUT /api/user/preference**: Update user language and difficulty preferences
- **GET /api/content/:id**: Get content with language and difficulty filtering

## Implementation Details

### Content Structure
- **English Beginner Content**: /docs/en/beginner/:content
- **English Advanced Content**: /docs/en/advanced/:content
- **Urdu Beginner Content**: /docs/ur/beginner/:content
- **Urdu Advanced Content**: /docs/ur/advanced/:content

### RAG Pipeline Adaptations
- **Context Retrieval**: Adjust relevance based on difficulty level
- **Response Generation**: Generate responses in selected language
- **Caching Strategy**: Cache responses by language and difficulty

## User Experience Flow

### Language Toggle Flow
1. User clicks language toggle button
2. System retrieves translated content from cache or requests AI translation
3. System applies RTL styling if Urdu is selected
4. System updates UI language settings
5. All subsequent content displays in selected language

### Difficulty Toggle Flow
1. User clicks difficulty toggle button
2. System retrieves content version matching selected difficulty
3. System updates UI difficulty settings
4. All subsequent content displays at selected difficulty level

## Error Handling

- **Translation API Failure**: Fallback to original language content
- **Database Connection Issues**: Display cached content or original language
- **Font Loading Issues**: Use appropriate fallback fonts for Urdu