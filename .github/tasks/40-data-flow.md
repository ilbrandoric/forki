# Task 40 — Data Flow & Ownership Model (Who Owns What and Who May Change It)

## Goal

Document the **data flow architecture of the game**, explaining where data is created, who owns it, who may mutate it, and who must only observe it.

This task teaches Copilot that **data has owners**, and that uncontrolled mutation is the fastest way to destroy the architecture.

---

## Why This Task Is Needed

Without explicit ownership rules, Copilot (and humans) will:

- mutate state from the wrong file
- pass data directly between entities
- duplicate derived values
- cache values that must stay live
- create “helper” variables that slowly diverge

This task prevents that by defining **clear, enforceable data boundaries**.

---

## Scope (Strict)

This task documents **existing data flow only**, derived from:

- `game-state.js`
- `main.js`
- `player.js`
- `box.js`
- `goal.js`
- `score.js`
- `timer.js`
- `obstacles.js`
- `collision.js`

No new data structures may be invented.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. Data Categories (Canonical)

Document all data in the game as belonging to one of these categories:

- **State data** (game phase, run status)
- **Entity data** (positions, DOM references)
- **Derived data** (collisions, win/loss conditions)
- **Display data** (text, UI values)
- **Configuration data** (constants, timings)

Explain why each category has different ownership rules.

---

### 2. Data Ownership Table (Single Source of Truth)

Provide a table listing:

- data name
- where it lives
- who owns it
- who may mutate it
- who may read it
- when it changes

This is the core guardrail for Copilot.

---

### 3. Mutation Rules (Non-Negotiable)

Document explicit rules such as:

- only the owner may mutate data
- mutation only happens during allowed states
- derived data is never stored
- UI never mutates game data
- entities never mutate global state

Explain why each rule exists.

---

### 4. Data Flow Direction (One-Way Arrows)

Explain and illustrate the allowed flow:

state → systems → entities → UI  
never the reverse

Make it clear that **data flows downward, never upward**.

---

### 5. Live Data vs Snapshots (Critical Distinction)

Explain which data is:
- live and always read fresh
- safe to snapshot
- dangerous to cache

Explain what breaks if this is misunderstood.

---

### 6. Common Data Corruption Failures (Educational)

Document failure modes such as:

- storing collision results
- caching state in entities
- copying position values
- letting UI hold game data
- duplicating counters or timers

Explain why each leads to desync.

---

## Definition of Done

This task is complete only when:

- A beginner can explain who owns which data
- Copilot does not mutate data from the wrong file
- Data flow is directional and explicit
- Ownership rules are unambiguous
- No code appears anywhere
- All descriptions are grounded in real files and behavior
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

Data has owners.  
Owners control mutation.  
Everyone else observes.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 41.
