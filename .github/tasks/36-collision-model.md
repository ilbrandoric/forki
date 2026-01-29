# Task 36 — Collision Model & Decision Authority (Who Decides What Happens)

## Goal

Document the **collision model of the game**, explaining how collisions are detected, who is responsible for checking them, and how different collision outcomes are decided.

This task makes explicit that **collisions are decisions, not physics**, and that only certain systems are allowed to act on them.

---

## Why This Task Is Needed

Collision systems are a common place where architecture silently degrades.

Without clear documentation, Copilot will tend to:
- turn collisions into physics
- centralize all collision logic in one place
- let entities decide their own outcomes
- duplicate collision checks across files
- mix detection with consequences

This task prevents that by defining **authority and boundaries**.

---

## Scope (Strict)

This task documents **existing collision behavior only**, derived from:

- `collision.js`
- `player.js`
- `box.js`
- `obstacles.js`
- `goal.js`
- `main.js`

No new collision systems may be invented.  
No physics may be added.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. Collision Detection vs Collision Decision (Core Split)

Explain the difference between:

- detecting overlap (geometry)
- deciding consequences (game rules)

Document where each lives and why they are intentionally separate.

---

### 2. Shared Collision Utility (Single Source of Truth)

Document the rectangle-based collision function:

- who uses it
- who must not reimplement it
- what assumptions it makes
- what it does *not* do

This prevents duplicate collision math.

---

### 3. Who Is Allowed to Check Collisions

Document which systems perform collision checks:

- player movement
- box movement
- obstacle updates
- goal checks

Explain why **moving systems check collisions**, not static ones.

---

### 4. Who Is Allowed to Decide Outcomes (Authority)

Document which systems are allowed to:

- block movement
- trigger game over
- increment score
- complete goals
- end the run

Explain why detection and consequences are not in the same file.

---

### 5. Collision Types (Conceptual)

Document the existing collision categories:

- blocking collisions
- terminal collisions
- success collisions
- neutral collisions

Explain how each is handled and by whom.

---

### 6. Common Collision Architecture Failures (Educational)

Document failure modes such as:

- entities deciding their own death
- collision.js triggering side effects
- duplicating checks across systems
- mixing physics with rules
- adding collision loops

Explain why each breaks the design.

---

## Definition of Done

This task is complete only when:

- A beginner can explain how collisions work
- Copilot does not turn collisions into physics
- Collision authority is clearly documented
- Detection and decision are separated
- No code appears anywhere
- All descriptions are grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style as previous `.github/tasks/`
- Diagrams or tables encouraged
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

Collisions detect.  
Systems decide.  
Rules live outside geometry.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 37.
