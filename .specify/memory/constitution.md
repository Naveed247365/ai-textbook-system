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
All book content must conform to a structured educational design. This includes logical flow, clear learning objectives, appropriate pedagogical approaches, and consistent formatting.

### V. Documented and Testable Endpoints
Every API endpoint developed for this system must be thoroughly documented, detailing inputs, outputs, and error conditions. Furthermore, each endpoint must be accompanied by comprehensive and passing tests to ensure functionality and reliability.

## Textbook Topics

The following topics must be fully included in all specifications and content generation for the "Physical AI & Humanoid Robotics Textbook System":

1.  Foundations of Physical AI
2.  Robotics Fundamentals
3.  Sensors & Actuators
4.  ROS2 Essentials
5.  Gazebo Simulation
6.  NVIDIA Isaac Sim
7.  Perception & Vision
8.  Vision-Language-Action (VLA) Models
9.  Machine Learning for Robotics
10. Humanoid Robotics
11. Jetson Edge Deployment
12. AI Agents for Robotics
13. Hands-on Labs
14. Quizzes & Assessments
15. Urdu Translation Layer
16. Personalization Layer

## System Goals

The "Physical AI & Humanoid Robotics Textbook System" aims to achieve the following:

-   Auto-generate a full Docusaurus textbook based on the specified topics.
-   Integrate a RAG chatbot linked exclusively to all book chapters.
-   Implement a "Select Text → Ask AI" feature within textbook chapters.
-   Provide personalized chapter difficulty adjustment capabilities.
-   Offer an Urdu translation toggle for all content.
-   Incorporate specialized subagents for quiz generation, lab generation, and code explanation.

## Tech Stack

The following technology stack will be utilized for the project:

-   Frontend: Docusaurus
-   Backend: FastAPI
-   Vector DB: Qdrant
-   DB: Neon Postgres
-   Auth: Better-Auth
-   LLMs: Gemini

## Governance
This Constitution supersedes all other project practices and documentation. Any amendments to this Constitution require a formal review process, documentation of rationale, and an approved migration plan for any affected systems or processes. Compliance with these principles must be verified in all Pull Requests and code reviews. Any increase in complexity must be explicitly justified against the principle of simplicity.

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02