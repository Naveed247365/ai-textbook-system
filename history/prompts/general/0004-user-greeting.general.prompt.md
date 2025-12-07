---
id: 0004
title: User greeting
stage: general
date: 2025-12-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 1-full-system-spec
user: user
command: hihi
labels: ["greeting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- history/prompts/general/0004-user-greeting.general.prompt.md
tests:

---

## Prompt

hihi

## Response snapshot

Hello! How can I help you today?

## Outcome

- ✅ Impact: Acknowledged user greeting.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: N/A
- 🧠 Reflection: Responded to user greeting and created a PHR.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
