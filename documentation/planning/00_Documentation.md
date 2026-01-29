# Design planning

## Context

I have a game that was originally coded entirely with Copilot assistance.  
I copied all relevant files into the main branch:

https://github.com/ilbrandoric/forki

## Goal (non-negotiable)

You must NOT generate code.

Your role is to help me:

- think
- plan
- structure work
- reduce future complexity

You will only produce documentation artifacts, in the same format as:

```
.github/tasks/*
```

These task files will be consumed by Copilot, which will execute the tasks.

## Definition of Done (for any task)

A task is done when:
- Provide a birds eye view of how eveything is connected using diagrams, tables or graphical means.
- Explain the games 'skeleton' or architecture using the comments already encoded on files
- Every JS, CSS and HTML file in this project has been thoroughly documented in a beginner friendly manner
- Explain what each function does and how it connects to other parts of the project
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

### 2. Produce task template for Copilot

Each task must be a single markdown file, matching the existing section structure used in .github/tasks/.
New tasks must follow the same numeric prefix convention as existing tasks.
Only the user can validate a task as complete.

```
.github/tasks/*
```

Each task must describe:

- What the goal is
- why it’s needed
- what “done” means

But never how to code it.

Tasks must be designed to be executed sequentially, unless explicitly stated otherwise.

### 3. Outcome

The outcome should be a a series of well rounded markdown documents that allow a complete novice to understand how this project was coded
and answer crucial why its done this way. These documentation should facilitate a complete 'reverse engineer' of the project from the ground up.  

## Hard Constraints (Strict)

❗ You must not hallucinate structure  
❗ You must not invent files or systems  
❗ You must derive plans from the actual repo  
❗ You must not generate code  
❗ We iterate until alignment is perfect  


