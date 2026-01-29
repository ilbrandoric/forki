# Task 37 — Screen System & UI Flow (What the Player Sees and When)

## Goal

Document the **screen system and UI flow**, explaining how screens are shown, hidden, and switched, and how UI is tied to game state rather than game logic.

This task makes explicit that **screens are views, not controllers**, and that they react to state instead of driving it.

---

## Why This Task Is Needed

UI is the easiest place for architecture to collapse.

Without clear documentation, Copilot will:
- put game logic in UI handlers
- let screens change state directly
- duplicate reset logic in buttons
- add UI-specific flags
- couple visuals to mechanics

This task prevents that by making **UI boundaries explicit**.

---

## Scope (Strict)

This task documents **existing UI behavior only**, derived from:

- `index.html`
- `game-state.js`
- `main.js`
- `score.js`
- `timer.js`

No new screens may be invented.  
No UI refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. Screen List (Canonical Views)

Document all screens that exist:

- start-screen
- game-screen
- game-over-screen

For each, document:
- purpose
- when it is visible
- which state activates it
- what it must never control

---

### 2. Screen Switching Mechanism

Document how screens are shown/hidden:

- which function controls visibility
- how state triggers screen changes
- why screens do not manage themselves
- why visibility is centralized

---

### 3. UI Elements as Observers (Not Drivers)

Document which UI elements observe state:

- score display
- timer display
- game-over message
- start / restart buttons

Explain:
- what they are allowed to do
- what they are not allowed to do
- how they react to state changes

---

### 4. Button Logic Boundaries

Explain why buttons:

- trigger transitions
- do not reset systems themselves
- do not mutate game data directly
- only signal intent

This is critical for preventing logic leaks.

---

### 5. Screen + State Failure Modes (Educational)

Document failure modes such as:

- UI calling reset functions directly
- screens owning state
- duplicating logic across screens
- hiding logic bugs with visibility toggles
- adding UI-only flags

Explain why each breaks the architecture.

---

## Definition of Done

This task is complete only when:

- A beginner can explain the UI flow
- Copilot does not add game logic to UI
- Screen switching is clearly documented
- UI is clearly separated from mechanics
- No code appears anywhere
- All descriptions are grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style as previous `.github/tasks/`
- Tables encouraged
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

Screens show.  
State decides.  
UI reacts.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 38.
