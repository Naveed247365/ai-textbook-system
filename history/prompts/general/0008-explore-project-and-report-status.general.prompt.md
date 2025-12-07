---
id: 0008
title: Explore project and report status
stage: general
date: 2025-12-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 1-full-system-spec
user: unknown
command: cheak kao na ham ai_textbook pe work kar rahe pora project read karo then mujhe btao kia kia kam ho chuka hai kia baki hai
labels: ["project-status", "exploration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- history/prompts/general/0008-explore-project-and-report-status.general.prompt.md
tests:
- none
---

## Prompt

cheak kao na ham ai_textbook pe work kar rahe pora project read karo then mujhe btao kia kia kam ho chuka hai kia baki hai

## Response snapshot

Main aapki 'ai_textbook' project ka jaiza le raha hoon. Iske liye main `Explore` agent ka istemal karunga, jo poore codebase ko padhkar aapko batayega ki kaun se kaam poore ho chuke hain aur kaun se baaki hain. Jab yeh task poora ho jayega, toh main aapko uski puri tafseelat faraham karunga.

## Outcome

- ✅ Impact: Initiated project exploration to provide a status update.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: Task tool call for project exploration.
- 🧠 Reflection: Successfully understood user's request for project overview and planned to use the Explore agent.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
