# Task 41 — File Responsibility Map (Why Each File Exists and What Must Live There)

## Goal

Document the **single responsibility of every file in the project**, explaining why each file exists, what it owns, and what must never be placed inside it.

This task teaches Copilot that **files are architectural boundaries**, not containers of convenience.

---

## Why This Task Is Needed

Even with good system documentation, architecture rots when file intent is unclear.

Without this task, Copilot will:
- move logic between files “for cleanliness”
- add helpers to the wrong file
- grow files organically until they blur
- mix responsibilities slowly and invisibly

This task locks **structural integrity at the file level**.

---

## Scope (Strict)

This task documents **existing files only**, derived from:

- `index.html`
- `style.css`
- `main.js`
- `js/main.js`
- `js/game-state.js`
- `js/player.js`
- `js/box.js`
- `js/goal.js`
- `js/obstacles.js`
- `js/collision.js`
- `js/score.js`
- `js/timer.js`

No new files may be invented.  
No files may be merged or split.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. File Inventory (Canonical List)

Create a table listing every file with:

- file name
- purpose (one sentence)
- what it owns
- what it may import
- what must never live here

This table is the **contract** for file-level architecture.

---

### 2. Responsibility Boundaries (Critical)

For each file, document:

- what kind of logic is allowed
- what kind of logic is forbidden
- what data it may mutate
- what data it may only read
- what side effects are allowed

This prevents logic leakage.

---

### 3. Why These Files Are Split This Way

Explain:
- why there is no “engine” file
- why entities are separate
- why utilities are isolated
- why state is centralized
- why UI is not logic

This teaches intent, not just structure.

---

### 4. Common File-Level Failure Modes (Educational)

Document failures such as:

- adding state to entity files
- putting logic in index.html
- adding helpers to collision.js
- putting UI code in systems
- importing entities into utilities

Explain why each breaks architecture.

---

## Definition of Done

This task is complete only when:

- A beginner can explain why each file exists
- Copilot does not move logic between files
- File intent is explicit and enforced
- Boundaries are unambiguous
- No code appears anywhere
- Everything is grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Tables required
- Beginner-friendly language
- Architecture-first, not implementation-first
- Same style as previous `.github/tasks/`

---

## Reminder (Non-Negotiable)

Files are boundaries.  
Boundaries protect architecture.  
Do not cross them.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 42.
