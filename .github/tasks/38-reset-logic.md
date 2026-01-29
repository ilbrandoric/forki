# Task 38 — Reset Logic & Idempotency Model (How the Game Safely Starts Over)

## Goal

Document the **reset architecture of the game**, explaining how resets are triggered, what gets reset, what must not be reset, and why resets are centralized and idempotent.

This task makes explicit that **reset is a lifecycle operation, not a side effect**, and that the game can be restarted safely without reloading the page.

---

## Why This Task Is Needed

Reset logic is where DOM games usually break.

Without clear documentation, Copilot will:
- re-create entities instead of resetting them
- reset in multiple places
- reset during the wrong state
- forget to reset hidden state
- introduce reload-based fixes

This task prevents that by defining **one reset model, one authority, one moment**.

---

## Scope (Strict)

This task documents **existing reset behavior only**, derived from:

- `game-state.js`
- `player.js`
- `box.js`
- `score.js`
- `timer.js`
- `goal.js`
- `obstacles.js`
- `main.js`

No new reset functions may be invented.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. What “Reset” Means in This Game (Canonical Definition)

Explain reset as:
- returning entities to known positions
- clearing transient state
- re-arming systems without reloading
- preparing for a new run

Also explain what reset is **not**:
- re-importing modules
- re-registering listeners
- re-creating loops
- reloading the page

---

### 2. Reset Authority (Single Owner)

Document where resets are triggered from and why:

- which function initiates resets
- why resets only happen during transitions
- why systems do not reset themselves
- why UI does not reset systems

This section must establish **one reset entry point**.

---

### 3. Idempotency (Why Reset Is Safe to Call Multiple Times)

Explain the idempotent design:

- calling reset twice does not break state
- positions are overwritten, not accumulated
- flags are reinitialized
- DOM is reused, not duplicated

This is critical for restart safety.

---

### 4. Reset Order (Dependency Safety)

Document the conceptual order of reset operations:

- state change
- entity resets
- score/timer resets
- spawn logic re-arming
- audio reset (if applicable)

Explain why this order matters and what breaks if changed.

---

### 5. What Is *Not* Reset (Intentional Persistence)

Document elements that persist across runs:

- event listeners
- intervals
- collision utilities
- DOM containers
- screen structure

Explain why persistence is intentional and safe.

---

### 6. Common Reset Failures (Educational)

Document failure modes such as:

- resetting inside loops
- resetting during play
- re-creating DOM nodes
- re-registering intervals
- using page reloads as reset

Explain why each breaks the architecture.

---

## Definition of Done

This task is complete only when:

- A beginner can explain how reset works
- Copilot does not duplicate or scatter reset logic
- Reset authority is unambiguous
- Idempotency is clearly documented
- No code appears anywhere
- All descriptions are grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style as previous `.github/tasks/`
- Tables or ordered lists encouraged
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

Reset is a lifecycle event.  
Reset is centralized.  
Reset is safe.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 39.
