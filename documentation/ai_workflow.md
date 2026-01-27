# AI-Assisted Development Workflow

## Overview

This document describes the structured workflow used to build Forkcraft, a simple browser game, using AI assistance (GitHub Copilot) with strict governance rules. The project was completed through 8 locked iterations, each building on the previous one without refactoring or scope expansion.

The workflow enforces:
- Iteration-locked development (one task at a time)
- Explain-before-code pattern
- Human approval gates
- Complexity ceiling using reference projects
- No premature optimization or abstraction

## Governance Model

### Core Rules

The project operated under non-negotiable rules defined in `.github/tasks/00-rules.md`:

1. **One iteration at a time** - Never skip, merge, or work ahead
2. **No working code modification** - Only add minimum required code
3. **No refactoring** unless explicitly requested
4. **No "improvements"** beyond task requirements
5. **Complexity ceiling** - Reference project (Flappy Bird) defines maximum complexity
6. **File restrictions** - Only touch files explicitly listed in each task

### Task File Structure

Each iteration had a locked task file:
- `00-rules.md` - Global governance
- `02-player.md` - Player movement
- `03-obstacles.md` - Obstacle movement
- `04-collision.md` - Collision detection
- `05-goal.md` - Win condition detection
- `06-score.md` - Score and timer
- `07-game-state.md` - Screen switching and state management
- `08-polish.md` - Final polish and difficulty tuning

Each task file specified:
- Goal for the iteration
- Allowed files to modify
- Forbidden changes
- Required DOM elements
- Success criteria

### Complexity Ceiling

The reference project (`reference/flappy-bird`) served as a complexity upper bound. Any solution more complex than the reference was rejected. This prevented:
- Over-engineering
- Premature abstraction
- Complex architectural patterns
- Unnecessary optimization

## Iteration Loop

Each iteration followed a strict 4-step loop:

### 1. Explain

The AI reads task requirements and explains the implementation plan in plain language before writing code.

**Human prompt template:**
```
You are implementing Iteration [N] of [Project].

Context to follow:
- .github/tasks/00-rules.md
- .github/tasks/[N]-[name].md

Reference complexity:
- reference/[project] (do not exceed)

Rules:
- Work ONLY on allowed files
- Do NOT modify HTML or CSS
- Do NOT add features
- Do NOT refactor
- Explain first, then generate code
- Stop when Iteration [N] is complete

Question:
Explain how you will implement [feature] for Iteration [N].
```

### 2. Review and Correct

The human reviews the explanation and corrects any violations:
- Complexity violations (e.g., using classes when simple functions suffice)
- Abstraction violations (e.g., creating frameworks)
- Scope violations (e.g., adding unrelated features)
- Architecture violations (e.g., new loops when existing ones should be reused)

**Correction pattern:**
```
This plan violates Iteration [N] rules.

Do NOT use:
- [forbidden pattern 1]
- [forbidden pattern 2]

Re-explain using ONLY:
- [allowed pattern 1]
- [allowed pattern 2]

Explain again, no code yet.
```

The AI revises the explanation until approved.

### 3. Approve and Generate

Once the explanation is correct, the human explicitly approves:

```
Approved. Generate the code now.

Files to update:
- [file1]
- [file2]

Rules reminder:
- Follow .github/tasks/00-rules.md
- Follow .github/tasks/[N]-[name].md
- No extra features
- No refactors
- Stop when done
```

The AI generates code only after explicit approval.

### 4. Test and Fix

If bugs appear, the human requests targeted fixes:

```
Bug fix for Iteration [N]:

[Description of bug]

Adjust logic so that:
- [expected behavior 1]
- [expected behavior 2]

Do NOT change anything else.
Only fix [filename].
```

Fixes are surgical and limited to the specific bug.

## AI Control Mechanisms

### Explain-Before-Code

The AI must explain its approach before writing any code. This prevents:
- Misunderstood requirements
- Over-complicated solutions
- Scope creep
- Architectural mistakes

The human can course-correct before any code is generated.

### Iteration Locking

Only one task file is active at a time. The AI:
- Cannot look ahead to future iterations
- Cannot "prepare" for future features
- Must complete current iteration before proceeding
- Stops work when iteration is complete

### Explicit Approval Gates

Code generation requires explicit human approval with the word "Approved." This prevents:
- Premature implementation
- Misaligned solutions
- Overeager feature addition

### Forbidden Patterns List

Each correction explicitly lists forbidden patterns:
- Classes (when functions suffice)
- Game loops (when events suffice)
- State objects (when simple variables suffice)
- New intervals (when existing intervals can be reused)
- Abstractions and frameworks

This trains the AI to stay simple.

### File Restrictions

Each task lists allowed files. The AI:
- Cannot create new files unless specified
- Cannot modify HTML unless specified
- Cannot modify CSS unless specified
- Must work within constraints

## Scope Creep Prevention

### No Feature Addition

Task files explicitly forbid:
- Extra features
- Quality-of-life improvements
- "Helpful" additions
- Optimization
- Refactoring

The AI implements exactly what is requested, nothing more.

### No Refactoring

Working code is never touched unless:
- It has a bug
- The current iteration requires modification
- The task explicitly requests refactoring

This prevents architectural churn and maintains stability.

### No HTML/CSS Changes

Most iterations forbid HTML and CSS changes. This:
- Forces work within existing structure
- Prevents scope expansion into visual design
- Maintains separation of concerns
- Keeps iterations focused

### Detection-Only Iterations

Some iterations (04, 05) were detection-only:
- Collision detection (console.log only, no game over)
- Goal detection (console.log only, no screen changes)

This broke complex features into smaller, testable pieces without jumping ahead.

## Debugging Strategy

### Surgical Fixes

Bug fixes follow a strict pattern:
1. Identify the specific bug
2. State expected behavior
3. Specify which file to fix
4. Forbid touching anything else

Example:
```
Bug fix for Iteration 06:

Timer goes negative.

Adjust logic so that:
- when timeRemaining reaches 0
- console.log("Time's up!") runs once
- clearInterval is called
- timer stops at 0
- no negative values

Do NOT change anything else.
Only fix timer.js.
```

### No Refactor During Debug

Bug fixes never become refactoring sessions. The fix is:
- Minimal
- Localized
- Tested
- Committed separately

## Restart Strategy

### Page Reload for Reset

The game uses `window.location.reload()` for restart instead of manual state reset. This:
- Avoids cross-module dependencies
- Prevents state synchronization bugs
- Keeps modules independent
- Simplifies architecture

No module needs to expose reset functions or know about other modules' state.

### Module Independence

Each module initializes independently when loaded:
- No coordination required
- No initialization order dependencies
- No shared state management
- Reload handles all cleanup automatically

## Why This Workflow Works

### Prevents Over-Engineering

The complexity ceiling and iteration locking prevent:
- Premature abstraction
- Framework creation
- Over-optimization
- Gold-plating

Solutions stay simple because complex solutions are rejected.

### Maintains Focus

One iteration at a time means:
- Clear current goal
- No distractions from future features
- Testable increments
- Steady progress

### Builds Incrementally

Each iteration adds one feature:
- Player movement (02)
- Obstacle movement (03)
- Collision detection (04)
- Goal detection (05)
- Score and timer (06)
- Game state (07)
- Polish (08)

Each builds on the previous without modifying it.

### Catches Mistakes Early

Explain-before-code catches:
- Misunderstood requirements
- Architectural mistakes
- Complexity violations
- Scope creep

Corrections happen before code is written, saving time.

### Preserves Simplicity

Forbidden refactoring means:
- Code stays readable
- No architectural churn
- No breaking changes
- Stable foundation

The MVP stays small and understandable.

## Reusing This Workflow

### For Other Projects

This workflow works for any project with:
- Clear feature boundaries
- Incremental development needs
- Risk of scope creep
- Risk of over-engineering

### Required Setup

1. Create `tasks/00-rules.md` with governance rules
2. Create locked task files for each iteration
3. Include reference project for complexity ceiling
4. Define allowed files per iteration
5. Define forbidden patterns per iteration

### Task File Template

```markdown
# Iteration [N] — [Feature Name]

## Goal

[One-sentence goal]

At the end of this iteration:
- [Observable outcome 1]
- [Observable outcome 2]
- [What should NOT exist yet]

## Files Allowed to Touch

- [file1] (new/modify)
- [file2] (only to import)

❌ No HTML changes
❌ No CSS changes
❌ No [forbidden action]

## Required DOM Elements

```txt
#element1
#element2
```

## Definition of Done

- [Success criterion 1]
- [Success criterion 2]
```

### Prompt Template Per Iteration

```
You are implementing Iteration [N] of [Project].

Read and follow strictly:
- .github/tasks/00-rules.md
- .github/tasks/[N]-[name].md

Reference complexity:
- reference/[project] (do not exceed)

Rules:
- Work ONLY on allowed files
- Do NOT modify HTML or CSS
- Do NOT add features
- Do NOT refactor
- Explain first, then generate code
- Stop when Iteration [N] is complete

Question:
Explain how you will implement [feature] for Iteration [N].
```

### Correction Template

```
Correction before coding:

- Do NOT [violation 1]
- Do NOT [violation 2]
- [Constraint 1]
- [Constraint 2]

Re-explain with these corrections. No code yet.
```

### Approval Template

```
Approved. Generate the code now.

Files to update:
- [file1]
- [file2]

Rules reminder:
- Follow tasks/00-rules.md
- Follow tasks/[N]-[name].md
- No extra features
- No refactors
- Stop when done
```

## Key Takeaways

1. **Explain before code** - Always review plans before implementation
2. **One iteration at a time** - Never work ahead or skip steps
3. **Complexity ceiling** - Use reference projects to prevent over-engineering
4. **Explicit approval** - Code generation requires human approval
5. **Surgical fixes** - Bug fixes are minimal and localized
6. **No refactoring** - Working code stays untouched
7. **File restrictions** - Each iteration specifies allowed files
8. **Forbidden patterns** - Explicitly list what NOT to do
9. **Detection first** - Break complex features into detection + consequences
10. **Reload for reset** - Avoid manual state management

## Adaptation Guidelines

### For Larger Teams

- Task files become sprint planning documents
- Explain-before-code becomes design review
- Approval gates become PR approval
- Iteration locking becomes sprint locking

### For Different AI Tools

- Adjust prompt templates for specific AI personalities
- Maintain explain-before-code pattern
- Keep explicit approval gates
- Preserve iteration locking

### For Different Project Types

- Adjust complexity reference (not always Flappy Bird)
- Adapt task granularity to project scale
- Maintain core principles: simplicity, incrementality, control
- Keep governance rules explicit and enforced

## Conclusion

This workflow demonstrates that AI can be effectively controlled through:
- Explicit rules and constraints
- Approval gates and iteration locking
- Explain-before-code patterns
- Complexity ceilings and reference projects

The result is predictable, incremental, simple software that stays within scope and maintains quality without over-engineering.
