# Task 39 — Audio System & Side-Effect Isolation (Non-Gameplay Systems)

## Goal

Document the **audio system and other side-effect-only systems**, explaining how they are triggered, how they observe state, and why they are intentionally isolated from gameplay logic.

This task teaches Copilot that **audio is a reaction, not a driver**, and that side effects must never control the game.

---

## Why This Task Is Needed

Side-effect systems (audio, visuals, effects) are where hidden coupling creeps in.

Without documentation, Copilot will:
- let audio drive state
- mix sound logic into gameplay systems
- trigger audio from entities
- add timing dependencies
- duplicate side effects in multiple places

This task prevents that by making **observation-only systems explicit**.

---

## Scope (Strict)

This task documents **existing side-effect behavior only**, derived from:

- `main.js`
- `game-state.js`
- `score.js`
- `timer.js`
- `player.js` (only where side effects are triggered)
- `index.html`

No new audio systems may be invented.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. What Counts as a Side Effect (Canonical Definition)

Explain what side effects are in this game:

- audio playback
- UI updates
- visual feedback
- messages and alerts

Also explain what is **not** a side effect:
- state changes
- collision decisions
- movement
- scoring rules

---

### 2. Audio System Overview

Document:

- where audio is initialized
- how it observes game state
- when audio starts and stops
- how mute / toggle is handled
- why audio never changes state

This must show audio as a **passive observer**.

---

### 3. Side Effects Observe State (One-Way Flow)

Explain the flow:

state → side effects  
never  
side effects → state

Use diagrams or tables to make this irreversible direction clear.

---

### 4. Why Side Effects Are Centralized

Document why side effects are not spread across entities:

- prevents duplication
- prevents desync
- keeps gameplay deterministic
- keeps debugging simple

Explain what breaks if side effects are triggered everywhere.

---

### 5. Side-Effect Failure Modes (Educational)

Document failure modes such as:

- audio triggering transitions
- sound logic in entities
- side effects inside loops
- UI effects mutating state
- side effects depending on timing loops

Explain why each breaks the architecture.

---

## Definition of Done

This task is complete only when:

- A beginner can explain how audio works
- Copilot does not let side effects control gameplay
- Audio is clearly documented as observer-only
- Side-effect boundaries are explicit
- No code appears anywhere
- All descriptions are grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style as previous `.github/tasks/`
- Tables or diagrams encouraged
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

Side effects observe.  
Gameplay decides.  
State is the authority.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 40.
