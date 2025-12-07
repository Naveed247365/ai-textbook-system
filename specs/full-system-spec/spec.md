<!--
Sync Impact Report:
- Version change: None -> 1.0.0 (initial)
- Modified requirements: All requirements defined from user input.
- Follow-up TODOs: None.
-->
# Feature Specification: Docusaurus UI/UX and Content Alignment

## 1. Introduction
This specification details the requirements for aligning the Docusaurus book's UI/UX and content with the provided style guide, ensuring a 100% visual match to the target design while retaining specific book chapters.

## 2. Docusaurus UI/UX Style Requirements (Target: ai-native.panaversity.org)

### 2.1. Color Palette
- **Background Dark:** `#0B0E14`
- **Background Section:** `#10141F`
- **Card Background:** `#141821`
- **Primary Blue:** `#46A5FF`
- **Accent Blue:** `#6CC3FF`
- **Accent Purple:** `#A285FF`
- **Text White:** `#F1F5F9`
- **Text Gray:** `#A1A7B3`
- **Border Subtle:** `#1D2333`
- **Code Block BG:** `#0E111A`
- **Code Border:** `#232B3A`

### 2.2. Typography
- **Primary Font:** Inter, sans-serif
- **Headings:** Inter ExtraBold / Bold
- **H1:** 48px
- **H2:** 36px
- **H3:** 28px
- **Body Text:** 17px
- **Line Height:** 1.65

### 2.3. Spacing System
- **Section Padding:** 96px top, 96px bottom
- **Block Padding:** 24px – 32px
- **Card Radius:** 14px
- **Card Shadow:** `rgba(0,0,0,0.45) 0px 4px 20px`
- **Sidebar width:** 270px
- **Content max width:** 920px

### 2.4. Layout
- **Top Navbar:** Transparent with subtle blur effect.
- **Sidebar:** Collapsible with soft border and hover effects.
- **Hero Section:**
    - Large headline.
    - Gradient highlight text (`#46A5FF` → `#A285FF`).
    - Subheading centered.
    - Two primary buttons with glow effect.
- **Cards Section:**
    - 3-column layout (responsive to 1 column on mobile).
    - Rounded, elevated, minimal borders.

### 2.5. Components
- **Info Box:**
    - `background: #10141F`
    - `border-left: 4px solid #46A5FF`
    - `padding: 20px`
- **Warning Box:**
    - `background: #141821`
    - `border-left: 4px solid #FFB84A`
    - `padding: 20px`
- **AI Highlight Box:**
    - `background: linear-gradient(135deg, #141821, #1A1E28)`
    - `border: 1px solid #232B3A`
    - `shadow: rgba(0,0,0,0.55) 0px 8px 25px`

### 2.6. Code Block Theme
- **Background:** `#0E111A`
- **Border-radius:** 10px
- **Syntax Highlight:** Dracula style
- **Keyword:** `#6CC3FF`
- **String:** `#A285FF`
- **Comment:** `#6B7280`

### 2.7. Responsive Rules
- **Mobile sidebar:** Hidden (toggle drawer)
- **Hero text:** Shrinks to 36px
- **Cards:** Convert to single column
- **Section padding:** Halves to 48px

### 2.8. Overall Feel
- Modern, dark, minimalistic
- Strong neon-accent look
- Smooth transitions on hover
- Rounded geometry with subtle glow

## 3. Content Requirements

The Docusaurus book chapters must remain exactly as follows:

1.  Foundations of Physical AI
2.  Robotics Fundamentals
3.  Sensors & Actuators
4.  ROS2 Essentials
5.  Gazebo Simulation
6.  NVIDIA Isaac Sim
7.  Perception & Vision
8.  Vision-Language-Action (VLA)
9.  Machine Learning for Robotics
10. Humanoid Robotics
11. Jetson Edge Deployment
12. AI Agents for Robotics
13. Hands-on Labs
14. Quizzes & Assessments
15. Urdu Translation Layer
16. Personalization Layer

## 4. Acceptance Criteria
- The Docusaurus site's UI/UX (design, layout, styling) must be a 100% visual match to the provided style guide.
- The Docusaurus site's content structure (chapters) must exactly match the list provided in Section 3.
- All styling elements (colors, typography, spacing, layout, components, code blocks, responsiveness) must be implemented as specified.

## 5. Non-Goals
- Changes to the core functionality of Docusaurus beyond styling and content organization.
- Altering the existing Spec-Kit workflow itself, only integrating the Docusaurus styling within it.

## 6. Open Questions
- N/A