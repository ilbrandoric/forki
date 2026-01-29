# Task 35 — Entity Model & Responsibility Boundaries (Who Exists and Why)

## Goal

Document the **entity model of the game**, explaining what entities exist, what their responsibilities are, and—most importantly—what they are *not* allowed to do.

This task teaches Copilot that entities in this project are **explicit, simple, and responsibility-bounded**, not abstracted or hierarchical.

---

## Why This Task Is Needed

The fastest way to destroy this architecture is to:

- turn entities into mini-engines
- let entities control state
- let entities talk to each other directly
- introduce inheritance or base classes
- move logic into the “wrong” file

Without clear boundaries, Copilot will naturally try to “clean up” the code by merging responsibilities.  
This task prevents that by making **ownership and limits explicit**.

---

## Scope (Strict)

This task documents **existing entities only**, derived from:

- `player.js`
- `box.js`
- `goal.js`
- `obstacles.js`
- `score.js`
- `timer.js`
- `collision.js`
- `game-state.js`

No new entities may be invented.  
No abstractions may be added.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. What Counts as an Entity (Canonical Definition)

Explain what “entity” means in this project:

- a DOM element
- with position
- with responsibility
- with limited authority

Also explain what is **not** an entity:
- state machine
- timers
- collision utilities
- screen controllers

---

### 2. Entity List (Single Source of Truth)

Document every entity that exists:

- Player
- Box
- Goal
- Cones
- Persons
- Rat

For each entity, document:
- where it is created
- what DOM it owns
- what it controls
- what it reacts to
- what it must never control

This should be presented as a table.

---

### 3. Responsibility Boundaries (Critical)

For each entity, explicitly document:

- what logic belongs here
- what logic must live elsewhere
- what it is allowed to mutate
- what it must only observe
- how it interacts with state (read-only vs trigger)

This section is the guardrail against logic leakage.

---

### 4. Entity Lifecycle (Create → Use → Destroy)

Document the lifecycle of each entity:

- when it is created
- when it becomes active
- when it is reset
- when it is removed
- who owns cleanup

Explain why **cleanup matters** in a DOM-based world (memory + visuals).

---

### 5. How Entities Interact (Without Coupling)

Explain how entities “interact” without talking directly:

- collisions as shared utility
- state as mediator
- score/timer as observers
- no direct imports between entities

This must reinforce that **entities never coordinate directly**.

---

### 6. Common Entity Design Failures (Educational)

Document failure modes such as:

- entities changing game state
- entities resetting themselves
- entities spawning other entities
- entities owning timers
- entities checking DOM instead of state

Explain why each breaks the architecture.

---

## Definition of Done

This task is complete only when:

- A beginner can explain what each entity does
- Copilot does not merge or abstract entities
- Responsibilities are clearly separated
- Entity lifecycles are explicit
- Interaction rules are unambiguous
- No code appears anywhere
- Everything is grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style as previous `.github/tasks/`
- Tables required
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

Entities are simple.  
Entities have borders.  
Entities do not coordinate.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 36.
