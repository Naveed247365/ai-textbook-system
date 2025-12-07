<!--
Sync Impact Report:
- Version change: Initial -> 1.0.0
- Modified principles: All principles defined from user input.
- Added sections: "Textbook Topics", "System Goals", "Tech Stack".
- Removed sections: None.
- Templates requiring updates:
    - .specify/templates/plan-template.md (⚠ pending)
    - .specify/templates/spec-template.md (⚠ pending)
    - .specify/templates/tasks-template.md (⚠ pending)
    - .specify/templates/commands/*.md (⚠ pending)
- Follow-up TODOs: None.
-->
# Physical AI & Humanoid Robotics Textbook System Constitution

## Core Principles

### I. Textbook Topic Adherence
The project must follow the exact topics listed in the "Textbook Topics" section below. All specifications and content generation must strictly adhere to this defined list.

### II. RAG Content Origin
RAG answers MUST exclusively originate from the content within the textbook chapters. No external sources or generalized LLM knowledge should be used for RAG responses.

### III. Modular and Clean Architecture
The system architecture must be modular, promote clean code practices, and utilize strict type checking. This ensures maintainability, scalability, and clarity across the codebase.

### IV. Structured Educational Design
All book content must conform to a structured educational design following a hierarchical organization of parts, chapters, and subchapters. This includes logical flow, clear learning objectives, appropriate pedagogical approaches, consistent formatting, and proper content nesting as seen in professional textbooks.

### V. Documented and Testable Endpoints
Every API endpoint developed for this system must be thoroughly documented, detailing inputs, outputs, and error conditions. Furthermore, each endpoint must be accompanied by comprehensive and passing tests to ensure functionality and reliability.

### VI. Docusaurus UI/UX Adherence
All Docusaurus outputs, including design, layout, user experience, and styling, must precisely match the provided style guide, ensuring 100% visual fidelity to the target design. This includes color palette, typography, spacing, layout, components, code block themes, and responsive rules. The UI must follow the book-like navigation structure with parts, chapters, and subchapters as seen in the reference textbook.

### VII. Bilingual Support System
The system must provide full bilingual support for English and Urdu as follows:
- Default language is English
- Toggle button appears at top-right of page and inside sidebar
- AI-based translation using Claude/Gemini/OpenAI for content translation
- Translated output cached in Neon/Postgres database
- Instant rendering on subsequent requests
- RAG system responds in the selected language
- Proper RTL (right-to-left) support for Urdu with "Noto Nastaliq Urdu" font
- Metadata { language: "en" | "ur" } for all content

### VIII. Personalized Learning Levels
The system must provide adaptive content based on learning difficulty levels:
- Beginner Mode: Simplified explanations, step-by-step breakdowns, easy examples, simple diagrams, basic code, extra hints
- Advanced Mode: Deep technical content, engineering-level details, complex integrations, advanced code examples, mathematical foundations
- User preference saved in Neon/Postgres upon signup via Better-Auth
- RAG pipeline adjusts context based on selected level
- Dual-version content files (e.g., my-chapter.en.beginner.md, my-chapter.en.advanced.md)
- UI toggle for difficulty level on each page
- Sub-agents (quiz_agent, lab_agent, explain_agent) generate difficulty-appropriate output

## Textbook Topics

The following topics must be fully included in all specifications and content generation for the "Physical AI & Humanoid Robotics Textbook System", organized in the following hierarchical structure:

### Part 1: Introduction to AI & Robotics
1.  Foundations of Physical AI
2.  Robotics Fundamentals

### Part 2: Core Technologies
3.  Sensors & Actuators
4.  ROS2 Essentials
5.  Simulation Environments (Gazebo and NVIDIA Isaac Sim)

### Part 3: Perception & Intelligence
6.  Perception & Vision
7.  Vision-Language-Action (VLA) Models
8.  Machine Learning for Robotics

### Part 4: Advanced Topics
9.  Deep Learning Architectures
10. Reinforcement Learning Principles
11. AI Agents for Robotics

### Part 5: Implementation & Deployment
12. Humanoid Robotics
13. Jetson Edge Deployment
14. Ethics and Future of AI

### Part 6: Practical Applications
15. Hands-on Labs
16. Quizzes & Assessments
17. Specialized Systems (Urdu Translation Layer, Personalization Layer)

## System Goals

The "Physical AI & Humanoid Robotics Textbook System" aims to achieve the following:

-   Auto-generate a full Docusaurus textbook following a hierarchical structure of parts, chapters, and subchapters.
-   Integrate a RAG chatbot linked exclusively to all book chapters.
-   Implement a "Select Text → Ask AI" feature within textbook chapters.
-   Provide personalized chapter difficulty adjustment capabilities.
-   Offer an Urdu translation toggle for all content.
-   Support bilingual content delivery and RAG responses.
-   Implement beginner and advanced learning level adaptations.
-   Incorporate specialized subagents for quiz generation, lab generation, and code explanation.

## Tech Stack

The following technology stack will be utilized for the project:

-   Frontend: Docusaurus
-   Backend: FastAPI
-   Vector DB: Qdrant
-   DB: Neon Postgres
-   Auth: Better-Auth
-   LLMs: Claude / Gemini / OpenAI

## Governance
This Constitution supersedes all other project practices and documentation. Any amendments to this Constitution require a formal review process, documentation of rationale, and an approved migration plan for any affected systems or processes. Compliance with these principles must be verified in all Pull Requests and code reviews. Any increase in complexity must be explicitly justified against the principle of simplicity.

**Version**: 1.2.0 | **Ratified**: 2025-12-05 | **Last Amended**: 2025-12-05