# Forkcraft Project Context Handoff

## Project State
- Project name: Forkcraft
- Current version: v1.0.0 shipped
- Current branch: feature/core-loop
- Current iteration: 09 — Pushable Cargo System
- Last completed iteration: 08 — Polish & Difficulty

## Development Workflow (MANDATORY)
- All work follows explain → review → approve → generate → test → commit
- Copilot must explain before writing code
- Iterations are locked once validated
- One system per iteration
- No refactors unless explicitly allowed
- No HTML/CSS changes unless task says so
- Restart strategy: page reload only
- No hidden side effects
- No cross-iteration changes

## Tooling
- Editor: VS Code
- Code generator: Copilot Chat
- Human review required before accepting code
- Tasks live in .github/tasks/

## Active Task
.github/tasks/09-pushable-cargo.md

## Objective of Iteration 09
- Add pushable box mechanic
- Player pushes box, cannot pull
- No delivery loop yet
- No scoring
- No randomness
- No new obstacles
- No new screens

## Files allowed this iteration
- js/player.js
- js/box.js (new)
- js/main.js

## Stop Rule
When Iteration 09 works:
- stop
- test manually
- commit
- ask for validation
