# Task 42 — Dependency Direction Rules (Import Law & Architecture Flow)

## Goal

Document the **allowed dependency directions between files**, defining who may import whom and which directions are forbidden.

This task teaches Copilot that **imports define architecture**, and that breaking direction rules silently breaks the system.

---

## Why This Task Is Needed

Without explicit import law, Copilot will:
- introduce circular dependencies
- import logic into UI
- import entities into utilities
- let everything depend on everything
- slowly flatten architecture

This task prevents that by making **dependency flow explicit and enforceable**.

---

## Scope (Strict)

This task documents **existing dependency directions only**, derived from the current repo structure and imports.

No new layers may be invented.  
No refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. Architectural Layers (Conceptual)

Define the existing layers (as they already exist):

- Entry (HTML / root JS)
- State & lifecycle
- Systems (timing, obstacles, entities)
- Utilities (collision)
- UI & side effects

Explain that these are **conceptual layers**, not folders.

---

### 2. Allowed Import Directions (Canonical Table)

Create a table showing:

- which layer may import which
- which imports are forbidden
- which are one-way only
- which must never be bidirectional

This is the core guardrail for Copilot.

---

### 3. Forbidden Dependency Patterns (Hard Rules)

Document forbidden patterns such as:

- utilities importing entities
- entities importing UI
- UI importing systems
- state importing entities
- circular imports at any level

Explain why each is dangerous.

---

### 4. Root vs Leaf Files (Authority Model)

Document:
- which files are roots (may import many)
- which files are leaves (should import none)
- why collision.js is a leaf
- why index.html is not a system
- why main.js is a coordinator, not a god file

---

### 5. How to Add New Files Safely (Rules for Copilot)

Explain how Copilot must decide where a new file belongs:
- which layer
- what it may import
- what may import it
- how to avoid cycles

This prevents future chaos.

---

## Definition of Done

This task is complete only when:

- A beginner can explain the dependency flow
- Copilot does not introduce circular imports
- Import directions are explicit
- Layering is respected
- No code appears anywhere
- Everything is grounded in real structure
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Tables required
- Diagrams encouraged
- Beginner-friendly language
- Architecture-first, not implementation-first
- Same style as previous `.github/tasks/`

---

## Reminder (Non-Negotiable)

Imports define architecture.  
Direction matters.  
Cycles are failures.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to optional documentation tasks.
