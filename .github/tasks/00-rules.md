# Forklift Game — AI & Project Rules

This document defines the **non-negotiable rules** for building the Forklift Game MVP.
Any violation of these rules invalidates the iteration.

---

## 1. Project Goal

Build a **small, complete, playable MVP** using:
- Vanilla JavaScript
- DOM manipulation only
- No frameworks
- No canvas
- No libraries

This is a learning + delivery project, not a demo of cleverness.

---

## 2. Iteration Rules (CRITICAL)

- Work on **ONE task file at a time**
- Never skip a task
- Never merge tasks
- Finish and validate before moving on
- No refactoring unless explicitly requested
- No “improvements” unless written in the task file

Each file in this folder represents a **locked iteration**.

---

## 3. Code Safety Rules

AI must:
- NOT modify working code
- NOT delete existing logic
- NOT rename IDs or classes
- NOT change HTML structure once created
- ONLY add the minimum code needed for the current task
- Touch only files mentioned in the task

If unsure → stop and explain first.

---

## 4. DOM Contract Rule

JS is only allowed to interact with elements from the DOM inventory defined in:

- documentation
- setup task
- HTML created in Iteration 1

No new DOM nodes without explicit approval.

---

## 5. Complexity Rule (VERY IMPORTANT)

Expected complexity must be:
- Equal or simpler than the reference project
- Never more complex
- Never more abstract
- Never more optimized

Reference:
`/reference/flappy-bird`

If a solution is more complex than Flappy Bird → it is wrong.

---

## 6. AI Behavior Rules

When working on tasks, AI must:
1. Explain the approach first
2. Wait for confirmation
3. Then provide code
4. Work on one file at a time
5. Stop after the task is complete

No multi-step jumps.  
No assumptions.

---

## 7. Definition of Done (for any task)

A task is done when:
- Code runs without errors
- Feature works as described
- No existing feature broke
- Result is validated by the user

Only then we move to the next task.

---

## 8. Final Rule

If something is unclear:
**STOP and ask before writing code.**

Breaking this rule is worse than being slow.
