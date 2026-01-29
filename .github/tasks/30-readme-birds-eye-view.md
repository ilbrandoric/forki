# Task 30 – Generate README.md (Bird’s-Eye View of Repository)

## MODE
You are in DOCUMENTATION mode.

You may CREATE or OVERWRITE the file:
- README.md (root)

You must NOT modify any other files.
You must NOT modify any JavaScript.
You must NOT modify HTML or CSS.
You must NOT add comments to code.
You must NOT refactor anything.
You must NOT invent systems or behavior.

This task is documentation only.

---

## GOAL

Generate a beginner-friendly README.md that explains the repository at a bird’s-eye view.

The README is the entry point for the entire project.
It should explain:
- what this project is
- how the files are organized
- how to navigate the codebase
- where deeper explanations live

The README must link to documentation files inside the `documentation/` folder.

The README must NOT explain implementation details inline.
It must only explain structure and navigation.

Think of this file as:
> “The map of the territory, not the territory itself.”

---

## REQUIRED CONTENT (IN ORDER)

### 1. Project Overview (What this is)
Explain in simple terms:
- this is a small browser game
- written in plain JavaScript
- no frameworks
- DOM is the game world
- everything is intentionally simple and explicit
- designed to be learnable and readable

Audience: a beginner who just opened the repo.

---

### 2. How to Run the Project
Explain:
- open index.html in a browser
- no build step
- no install
- no dependencies

Keep it short and clear.

---

### 3. Repository Structure (High Level)

A quick guided tour of the top level:

- `index.html` → entry point that defines the world
- `style.css` → visuals only
- `js/` → all game logic
- `documentation/` → human-readable explanations
- `.github/tasks/` → Copilot instruction history (process, not runtime)
- `archive/` → historical reference (v1)
- `reference/` → inspiration material
- `assets/` → audio or images


This section should read like a guided tour.

---

### 4. Runtime Architecture (Very High Level)

Explain without code:
- The DOM is the world
- Entities are DOM elements
- Movement is pixel-based
- Collisions use DOM rectangles
- State controls when systems run
- Timing is split into:
  - event-driven (player)
  - interval-driven (obstacles, timer)

Do NOT explain how it’s implemented.
Only explain the idea.

---

### 5. Navigation Guide (Where to read next)

Explain where to go for deeper understanding.

Add links to:
- documentation/architecture-overview.md (if missing, link anyway)
- documentation/boot-flow.md
- documentation/state-machine.md
- documentation/world-model.md
- documentation/entities/player.md
- documentation/entities/box.md
- documentation/entities/rat.md
- documentation/entities/persons.md
- documentation/entities/cones.md

It is OK if these files do not exist yet.
They will be created later.

---

### 6. Philosophy & Constraints (Important)

Explain:
- this project avoids frameworks on purpose
- clarity > abstraction
- no hidden magic
- no engines
- no build step
- everything visible
- everything traceable

Explain that the repo is meant to be **read and understood**, not just played.

---

## STYLE RULES

- Use clear, simple language
- Assume beginner audience
- No jargon without explanation
- No code blocks (except file names)
- No deep technical detail
- Use headings
- Use bullet lists
- Be calm, clear, and instructional
- Do NOT sound like marketing
- Do NOT sound academic
- Sound like a friendly engineer explaining a system

---

## OUTPUT

Create or overwrite:
- README.md (root)

Do not output anything else.
Do not modify anything else.

When finished, STOP.
