# Task 33 — State Machine & Lifecycle Documentation (Runtime Control Architecture)

## Goal

Document the **game state machine and lifecycle**, explaining how state controls what systems are allowed to run, when they run, and when they must stop.

This task makes explicit that **state is the traffic light of the entire game**, not just a variable — and that every moving system obeys it.

---

## Why This Task Is Needed

After boot flow is understood, the next source of bugs (for humans and Copilot) is always the same:

> systems running at the wrong time

Without clear documentation of the state machine:

- timers may run during start or game over
- obstacles may move when they shouldn’t
- input may be accepted when it should be ignored
- resets may happen in the wrong phase
- new features may bypass state entirely

This task prevents that by making the lifecycle **explicit, visual, and non-negotiable**.

---

## Scope (Strict)

This task documents **existing state behavior only**.

It must be derived from:

- `js/game-state.js`
- `main.js`
- `player.js`
- `obstacles.js`
- `timer.js`
- `score.js`
- `goal.js`
- `box.js`

No new states may be invented.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. The State List (Canonical)

Document all existing game states and **only those that exist**.

For each state:
- name
- purpose
- which screen is visible
- which systems are allowed to run
- which systems must be blocked

This must result in a **single source of truth table**.

---

### 2. State Transitions (Lifecycle Flow)

Document all legal transitions:

- start → playing
- playing → gameOver
- gameOver → start (restart)

For each transition, explain:
- what triggers it
- what side effects happen
- what resets occur
- what *must not* happen

Describe transitions as **conceptual events**, not code.

---

### 3. System Gating (Who Obeys State)

For each major system, document:

- how it checks state
- what happens if state is wrong
- whether it is event-driven or loop-driven
- what state violations would break

This section must make it impossible to accidentally bypass state.

---

### 4. State as a Safety Mechanism (Why This Design Exists)

Explain why this game uses **state gating instead of start/stop loops**, including:

- why intervals are always running
- why behavior is blocked instead of destroyed
- why resets are centralized
- why state is checked everywhere

This section teaches *why the architecture looks “weird” but is correct*.

---

### 5. Common State Bugs (Educational Guardrails)

Document typical failure modes:

- adding logic that ignores state
- running logic in multiple states
- resetting outside transitions
- checking DOM instead of state
- using flags instead of state

Explain why these are dangerous in this architecture.

---

## Definition of Done

This task is complete only when:

- A beginner can explain all states and transitions
- Copilot can safely add new features without breaking lifecycle
- State is clearly shown as the runtime authority
- Every system’s relationship to state is documented
- No code appears anywhere
- All descriptions are grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style and tone as previous `.github/tasks/`
- Tables and structured sections required
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

State controls behavior.  
Systems obey state.  
Transitions are sacred.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 34.
