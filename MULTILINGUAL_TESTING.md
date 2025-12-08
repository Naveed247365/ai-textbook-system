# Multilingual Features Testing Guide

This document provides instructions for testing the multilingual features of the Physical AI & Humanoid Robotics Textbook system.

## Overview

The system supports:
- **Languages**: English (en) and Urdu (ur)
- **Difficulty Levels**: Beginner and Advanced
- **Content Types**: Chapters, quizzes, labs, and dynamic content

## Content Structure

### File Organization
```
docusaurus-chapters/
├── part1-introduction-ai-robotics/
│   └── chapter1-foundations-physical-ai/
│       ├── 1-introduction-ai-robotics.md          # Default (English)
│       ├── 1-introduction-ai-robotics.en.beginner.md
│       ├── 1-introduction-ai-robotics.en.advanced.md
│       ├── 1-introduction-ai-robotics.ur.beginner.md
│       └── 1-introduction-ai-robotics.ur.advanced.md
└── ...
```

### Language Codes
- `en` = English
- `ur` = Urdu
- `beginner` = Beginner difficulty
- `advanced` = Advanced difficulty

## API Testing

### Translation API
The system provides translation endpoints for real-time translation:

```bash
# English to Urdu translation
curl -X POST https://your-backend-url/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial Intelligence is a branch of computer science",
    "source_language": "en",
    "target_language": "ur",
    "difficulty_level": "beginner"
  }'

# Urdu to English translation
curl -X POST https://your-backend-url/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مصنوعی ذہانت کمپیوٹر سائنس کی ایک شاخ ہے",
    "source_language": "ur",
    "target_language": "en",
    "difficulty_level": "beginner"
  }'
```

### Expected Response Format
```json
{
  "original_text": "Original text here",
  "translated_text": "Translated text here",
  "source_language": "en",
  "target_language": "ur",
  "difficulty_level": "beginner",
  "from_cache": false
}
```

## Testing Scenarios

### 1. Content Translation
**Test**: Verify translation between English and Urdu
- [ ] English to Urdu translation works
- [ ] Urdu to English translation works
- [ ] Translation accuracy for technical terms
- [ ] Caching functionality (subsequent requests should be faster)

### 2. Difficulty Levels
**Test**: Verify content differentiation by difficulty
- [ ] Beginner content is simpler than advanced
- [ ] Technical terms are explained in beginner level
- [ ] Advanced content includes more complex concepts
- [ ] Appropriate complexity for each level

### 3. Chapter Navigation
**Test**: Verify multilingual chapter access
- [ ] English chapters load correctly
- [ ] Urdu chapters load correctly
- [ ] Language switching maintains chapter position
- [ ] Navigation works in both languages

### 4. Interactive Features
**Test**: Verify multilingual support for interactive elements
- [ ] Quizzes available in both languages
- [ ] Labs available in both languages
- [ ] Answers and feedback in selected language
- [ ] Code explanations in selected language

## Manual Testing Steps

### Step 1: Content Verification
1. Navigate to a chapter in English
2. Switch to Urdu
3. Verify content is properly translated
4. Switch back to English
5. Verify original content is restored

### Step 2: Translation API Testing
1. Test the translation endpoint with various inputs
2. Verify response format
3. Test both language directions
4. Test with different difficulty levels

### Step 3: User Interface Testing
1. Language switcher functionality
2. RTL (Right-to-Left) layout for Urdu
3. Proper text rendering for Urdu
4. Navigation consistency across languages

### Step 4: Performance Testing
1. Translation speed
2. Caching effectiveness
3. Page load times in both languages
4. API response times

## Automated Testing Script

Create a test script to verify multilingual functionality:

```bash
#!/bin/bash

BACKEND_URL="https://your-backend-url.railway.app"
echo "Testing multilingual features at $BACKEND_URL"

# Test 1: Translation API
echo "1. Testing Translation API..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test for multilingual support",
    "source_language": "en",
    "target_language": "ur",
    "difficulty_level": "beginner"
  }')

if [[ $RESPONSE == *"translated_text"* ]]; then
  echo "✓ Translation API test passed"
else
  echo "✗ Translation API test failed"
fi

# Test 2: Health check
echo "2. Testing health endpoint..."
HEALTH=$(curl -s "$BACKEND_URL/health")
if [[ $HEALTH == *"healthy"* ]]; then
  echo "✓ Health check passed"
else
  echo "✗ Health check failed"
fi

echo "Multilingual testing completed"
```

## Quality Assurance for Urdu Content

### Text Rendering
- [ ] Urdu text displays correctly
- [ ] Proper RTL alignment
- [ ] No character encoding issues
- [ ] Special characters render properly

### Translation Quality
- [ ] Technical terms translated accurately
- [ ] Context preserved in translation
- [ ] Grammar and syntax correct
- [ ] Cultural appropriateness maintained

### User Experience
- [ ] Navigation intuitive for Urdu speakers
- [ ] Consistent terminology throughout
- [ ] Appropriate reading level for difficulty setting
- [ ] Cultural references appropriate

## Common Issues and Solutions

### Text Rendering Issues
- **Problem**: Urdu text not displaying correctly
- **Solution**: Verify UTF-8 encoding, check font support

### Translation Accuracy
- **Problem**: Technical terms not translated properly
- **Solution**: Use domain-specific translation models or glossary

### Performance Issues
- **Problem**: Slow translation response
- **Solution**: Verify caching is working, check API quotas

### API Errors
- **Problem**: Translation API returning errors
- **Solution**: Check API keys, verify rate limits

## Content Verification Checklist

### English Content
- [ ] All chapters available
- [ ] Technical accuracy verified
- [ ] Difficulty levels appropriate
- [ ] Consistent terminology

### Urdu Content
- [ ] All chapters translated
- [ ] Technical accuracy maintained
- [ ] Cultural appropriateness verified
- [ ] Consistent terminology with English

### Cross-Language Consistency
- [ ] Same concepts covered in both languages
- [ ] Equivalent difficulty levels
- [ ] Consistent structure and navigation
- [ ] Proper linking between language versions

## Monitoring and Analytics

### Translation Usage
- Track translation API usage
- Monitor most frequently translated content
- Identify content requiring improvement

### User Engagement
- Language preference analytics
- Content consumption by language
- Feature usage by language

## Next Steps

1. Deploy backend with proper API keys
2. Test translation functionality
3. Verify content availability in both languages
4. Test difficulty level differentiation
5. Validate user interface in both languages
6. Monitor performance and usage
7. Gather user feedback
8. Iterate based on findings

## Expected Outcomes

After successful multilingual testing:
- Users can seamlessly switch between English and Urdu
- Content maintains quality and accuracy in both languages
- Technical concepts are properly explained at appropriate difficulty levels
- User experience is consistent across languages
- Performance remains optimal with multilingual features enabled