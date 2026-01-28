# Forki Learning & Rebuild Plan

## Purpose

This project is a **guided reconstruction** of the Forki forklift game.

The goal is NOT to “finish a game” (it already exists),
but to **learn how the game is built from scratch**, step by step, using the final version as a reference.

I am rebuilding the game intentionally, with mentorship, to deeply understand:
- DOM manipulation
- JavaScript game loops
- State management
- Input handling
- Collision logic
- Asset integration
- Architecture decisions

---

## Repository Structure Philosophy

### Branches

#### `main` branch (REFERENCE – DO NOT TOUCH)
- Contains the fully working game
- Acts as the “answer sheet”
- Used only for:
  - comparison
  - future polish
  - graphics & sound improvements

#### `learn` branch (ACTIVE LEARNING ZONE)
- Game is rebuilt from zero
- Code is written step by step
- Each concept is isolated
- Each step is committed
- Breaking things is allowed

---

## Learning Method

- Start with an empty HTML shell
- Rebuild one system at a time
- Compare with `main` only when needed
- Copy-paste is allowed, but must be **understood**
- Every major concept = one commit
- Every commit must run

---

## Rebuild Roadmap (Order Matters)

### Phase 1: Foundation
1. Empty HTML + CSS reset
2. Game container creation
3. Basic layout + dimensions
4. Game loop (requestAnimationFrame)
5. Game state object

### Phase 2: Player (Forklift)
6. Forklift DOM creation
7. Positioning system (x, y)
8. Keyboard input
9. Movement logic
10. Boundary constraints

### Phase 3: World
11. Obstacles (static)
12. Collision detection (AABB)
13. Pushable objects
14. Physics-lite behavior
15. Reset logic

### Phase 4: Game Systems
16. Score system
17. Win / lose conditions
18. Timer or move counter
19. Game states (menu, playing, gameover)
20. Restart flow

### Phase 5: Modes & UI
21. Game modes
22. Mode selection UI
23. HUD (score, info)
24. Messages & overlays

### Phase 6: Polish
25. Sound effects
26. Background
27. Animations
28. Visual feedback
29. Performance pass

---

## Rules

- Never modify `main` while learning
- Never add features before rebuilding the base
- Every commit must represent a concept
- If confused: stop and explain before continuing
- If something breaks: fix before moving on

---

## End Goal

Once the rebuild reaches parity with `main`:
- Improve graphics
- Improve sounds
- Add small gameplay polish
- Refactor with confidence
- Truly understand how the game works

---

## Mentor Contract

- One step at a time
- No skipping
- No magic code
- No unexplained jumps
- Learning > speed

This is a **reconstruction, not a tutorial**.
