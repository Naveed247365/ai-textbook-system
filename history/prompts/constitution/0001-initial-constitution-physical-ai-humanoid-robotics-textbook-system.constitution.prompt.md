---
id: 0001
title: Initial Constitution for Physical AI & Humanoid Robotics Textbook System
stage: constitution
date: 2025-12-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["governance", "constitution", "initial-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
null
---

## Prompt

```text
You are building a full AI-driven textbook platform called:

"Physical AI & Humanoid Robotics Textbook System".
TEXTBOOK TOPICS (must be fully included in all specifications):

1. Foundations of Physical AI

2. Robotics Fundamentals

3. Sensors & Actuators

4. ROS2 Essentials

5. Gazebo Simulation

6. NVIDIA Isaac Sim

7. Perception & Vision

8. Vision-Language-Action (VLA) Models

9. Machine Learning for Robotics

10. Humanoid Robotics

11. Jetson Edge Deployment

12. AI Agents for Robotics

13. Hands-on Labs

14. Quizzes & Assessments

15. Urdu Translation Layer

16. Personalization Layer
SYSTEM GOALS:

- Auto-generate a full Docusaurus textbook based on the above topics.

- Integrate a RAG chatbot linked to all book chapters.

- Add "Select Text → Ask AI" feature inside chapters.

- Provide personalized chapter difficulty adjustment.

- Provide Urdu translation toggle.

- Subagents: quiz generator, lab generator, code explainer.
TECH STACK:

Frontend: Docusaurus

Backend: FastAPI

Vector DB: Qdrant

DB: Neon Postgres

Auth: Better-Auth

LLMs: Gemini
Constitution Rules:

1. The project must follow the exact topics listed above.

2. RAG answers MUST come only from chapter content.

3. Architecture must be modular & clean with typed code.

4. Book content must follow structured educational design.

5. Every endpoint must be documented and testable.
```

## Response snapshot

The project constitution has been updated to version 1.0.0. The core principles, textbook topics, system goals, and tech stack have been incorporated.

Files flagged for manual follow-up for consistency updates:
- .specify/templates/plan-template.md
- .specify/templates/spec-template.md
- .specify/templates/tasks-template.md
- .specify/templates/commands/*.md

## Outcome

- ✅ Impact: Constitution document created and updated with core principles, textbook topics, system goals, and tech stack.
- 🧪 Tests: No tests run for constitution update.
- 📁 Files: Updated .specify/memory/constitution.md.
- 🔁 Next prompts: Review of dependent templates (plan, spec, tasks, commands) for consistency.
- 🧠 Reflection: Successfully initialized project constitution based on user input. Need to propagate changes to dependent templates.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
