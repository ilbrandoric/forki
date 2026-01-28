# Design planning

## Context

I have a game that was originally coded entirely with Copilot assistance.  
I copied all relevant files into a new branch:

👉 https://github.com/ilbrandoric/forki/blob/version-2/index.html

The version-2 branch is the base for a structured upgrade, not a rewrite.  
Existing logic must be respected, not replaced.

## Goal (non-negotiable)

You must NOT generate code.

Your role is to help me:

- think
- plan
- structure work
- reduce future complexity

You will only produce planning artifacts, in the same format as:

```
.github/tasks/*
```

These task files will be consumed by Copilot, which will implement the changes.

## Definition of Done (for any task)

A task is done when:
- Code runs without errors
- Feature works as described
- No existing feature broke
- Result is validated by the user

Only then we move to the next task.

## Division of labor

**You + me = architects & planners**  
**Copilot = builder**

If you generate code, you failed the task.

## Your Responsibilities

### 1. Review the repository as it exists

You must base all plans on actual existing structure, not assumptions.

You will review the current files:

https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/style.css  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/main.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/index.html  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/box.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/collision.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/game-state.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/goal.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/main.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/obstacles.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/player.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/score.js  
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/js/timer.js  

You will review the current tasks to understand how the game was developed (as reference for Copilot consumption):


https://github.com/ilbrandoric/forki/blob/version-2/.github/tasks/README.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/00-rules.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/01-setup.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/02-player.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/03-obstacles.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/04-collision.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/05-goal.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/06-score.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/07-game-state.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/08-polish.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/09-pushable-cargo.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/10-cargo-delivery.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/11-obstacle-failure.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/12-timer-lifecycle.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/13-fix-cone-initialization.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/13-static-obstacles.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/14-cone-blocking-integration.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/15-fix-blocking-decision-point.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/16-add-movement-approval-hook.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/17-persons-moving-hazards.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/18-remove-static-obstacle-html.md
https://raw.githubusercontent.com/ilbrandoric/forki/refs/heads/version-2/.github/tasks/19-game-audio-toggle.md


You are not allowed to invent files, systems, or abstractions that are not grounded in the repo.

### 2. Suggest architectural improvements (planning only)


Architectural changes must be incremental refactors of existing files and flows.
New systems or abstractions may only be introduced if a task explicitly justifies them based on current limitations in the repo.

- Makes future improvements easier
- Enables new elements without hacks or duplication
- Reduces coupling between game objects
- Moves toward consistency and clarity
- Preserves existing behavior unless explicitly changed

These suggestions must be expressed as task plans, not code, not pseudo-code.

### 3. Produce task templates for Copilot

Each task must be a single markdown file, matching the existing section structure used in .github/tasks/.
New tasks must follow the same numeric prefix convention as existing tasks.
Only the user can validate a task as complete.

```
.github/tasks/*
```

Each task must describe:

- what to change
- why it’s needed
- what “done” means

But never how to code it.

Tasks must be designed to be executed sequentially, unless explicitly stated otherwise.

## Structural Change Requirement (Conceptual Only)

All game entities must be treated consistently as objects, including:

- Player (forklift)
- Barriers (obstacles)
- Persons (obstacles)
- Rat (new obstacle)

This implies (conceptually, not code):

- Shared lifecycle
- Shared positioning rules
- Shared update/render flow
- Shared collision participation
- A base object model (as a design idea, not implementation detail)

## New Element to Plan

**New obstacle: Rat**

- Appears randomly
- Exists temporarily or moves
- Disappears when leaving world bounds
- Collision with player → game over

This must be introduced via architecture-friendly planning, not one-off hacks.

## Visual Improvements (Planning Only)

Improve the visual representation of:

- Player (forklift)
- Barriers
- Box
- Persons
- Background

Emoji-based visuals should be replaced by font-based or styled glyphs (planned, not implemented here).

## Game Positioning & Layout

The game must be centered properly, independent of screen quirks.

Planning should assume:

- A fixed or constrained world area
- A background frame around the game
- Centered canvas or container
- Clear separation between “world” and “page”

Suggested baseline (design reference only):

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #111;
  color: white;
  font-family: sans-serif;
}
```

## Fonts (Planning Only)

Suggest one appropriate font that:

- Replaces emoji visuals
- Works for game glyphs
- Improves readability and style
- Is realistic for web usage

Font choice must be justified in the task plan.

## Code comments 

Tasks may instruct Copilot to preserve or add one-line comments where appropriate.
You must not write comments yourself, only plan for them.

## Hard Constraints (Strict)

❗ You must not hallucinate structure  
❗ You must not invent files or systems  
❗ You must derive plans from the actual repo  
❗ You must not generate code  
❗ We iterate until alignment is perfect  


