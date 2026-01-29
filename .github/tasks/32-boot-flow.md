# Task 32 — Boot Flow Documentation (Startup Architecture for Copilot)

## Goal

Document the complete **boot flow of the game**, from browser load to the moment the game enters an active playable state, using only the existing files and behavior in the repository.

This task exists so Copilot can clearly understand **what runs first, what runs later, and what must wait for user input**, without guessing, reordering, or coupling systems incorrectly.

This is not about adding new behavior.
This is about **making the startup sequence explicit, visible, and safe to reason about**.

---

## Why This Task Is Needed

Right now, the game boots correctly — but that knowledge lives implicitly in the code and in the developer’s head.

For an AI builder (Copilot), this is dangerous because:
- Startup logic is easy to accidentally duplicate
- Systems may be initialized too early
- Side effects may run before the game is ready
- State may be mutated before the player presses start

By documenting the boot flow, we establish a **single source of truth** for how the game comes alive.

This also creates a mental model for beginners:
> “The game does not start when the page loads — it starts when the state allows it.”

---

## Scope (Strict)

This task only documents **existing behavior**.

It must be derived from:
- `index.html`
- `main.js`
- `js/main.js`
- `js/game-state.js`
- and the side effects visible in other systems during load

No new systems may be invented.
No refactors may be implied.
No code may be written.

---

## What Must Be Documented

### 1. Browser → Game Handoff

Explain, in plain language and/or diagrams:

- What the browser loads first
- How `index.html` acts as the entry point
- How script loading leads to JavaScript execution
- Which file is the *true* runtime entry

This section should make it impossible to misunderstand **where the game begins**.

---

### 2. Initialization Phase (Before Play)

Document what systems are created or prepared **before the player presses start**:

- DOM elements that are created immediately
- Event listeners that are attached at load time
- State variables that are initialized
- Systems that are idle but armed

This should clearly separate:
- setup work
- from gameplay work

---

### 3. The Waiting State (Start Screen Logic)

Explain how the game enters a **waiting state** after load:

- Which state represents “not playing yet”
- Which systems are blocked during this time
- Which systems are allowed to run
- Why nothing moves yet

This section must make it clear that:
> loading ≠ playing

---

### 4. Transition to Active Play

Document the exact conceptual moment when:

- the state changes
- timers begin
- obstacles begin moving
- player input becomes meaningful

This should be described as a **state transition**, not as a technical implementation.

---

### 5. Dependency Ordering (Critical)

Provide a table or diagram showing:

- Which systems depend on others being initialized first
- Which systems are safe to initialize early
- Which systems must wait for the playing state

This is the guardrail that prevents Copilot from reordering boot logic incorrectly.

---

### 6. Common Failure Modes (Educational)

List and explain:

- what breaks if systems start too early
- what breaks if state is ignored
- what breaks if boot logic is duplicated

This section exists to teach **why the boot flow is structured this way**.

---

## Definition of Done

This task is complete only when:

- A beginner can explain the boot flow back to you
- Copilot can follow the startup sequence without guessing
- The difference between loading, waiting, and playing is explicit
- The document uses diagrams, tables, or structured sections to show flow
- No code appears anywhere in the document
- Everything is grounded in real files and real behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same structure and tone as previous tasks in `.github/tasks/`
- Beginner-friendly language
- Explicit, not clever
- Architecture-focused, not implementation-focused

---

## Reminder (Non‑Negotiable)

Copilot builds.
You document.
If code appears, the task has failed.

Only when the user validates this task may we move to Task 33.

