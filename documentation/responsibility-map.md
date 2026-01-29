# File Responsibility Map

## Scope (Existing Files Only)

This document is grounded in:
- [index.html](index.html#L1-L47)
- [style.css](style.css#L1-L254)
- [js/main.js](js/main.js#L1-L105)
- [js/game-state.js](js/game-state.js#L1-L77)
- [js/player.js](js/player.js#L1-L147)
- [js/box.js](js/box.js#L1-L128)
- [js/goal.js](js/goal.js#L1-L60)
- [js/obstacles.js](js/obstacles.js#L1-L356)
- [js/collision.js](js/collision.js#L1-L48)
- [js/score.js](js/score.js#L1-L50)
- [js/timer.js](js/timer.js#L1-L75)

No new files are introduced.

---

## 1. File Inventory (Canonical List)

| File | Purpose (One Sentence) | What It Owns | What It May Import | What Must Never Live Here |
|---|---|---|---|---|
| [index.html](index.html#L1-L47) | Declares the game’s screens and DOM structure | Screen layout, HUD elements, game area DOM | Nothing | Game logic, state changes, or behavioral code |
| [style.css](style.css#L1-L254) | Defines visual appearance only | Visual styles for screens, HUD, entities | Nothing | Game logic, state, or DOM creation |
| [js/main.js](js/main.js#L1-L105) | Bootstraps systems and owns audio management + movement approval | Audio system, `canMove()` gate | All systems it wires together | Entity logic, state transitions, UI text rules |
| [js/game-state.js](js/game-state.js#L1-L77) | Owns game state and screen transitions | `gameState`, `showScreen()`, `triggerGameOver()` | Reset helpers + rat helpers | Movement logic, collision rules, per-entity updates |
| [js/player.js](js/player.js#L1-L147) | Handles player input and movement | Player position, key handling | Goal, box, collision, movement approval | Global state changes, obstacle spawning |
| [js/box.js](js/box.js#L1-L128) | Handles box position and push rules | Box position, push helpers | Movement approval | State changes, win/loss decisions |
| [js/goal.js](js/goal.js#L1-L60) | Owns win condition check | Goal flag and win trigger | Collision, score, state triggers, box | Movement logic or screen visibility |
| [js/obstacles.js](js/obstacles.js#L1-L356) | Owns cones/persons/rat movement and hazard outcomes | Obstacle arrays, spawn guards, hazard checks | Collision, state, rat helpers | Player input handling or game state ownership |
| [js/collision.js](js/collision.js#L1-L48) | Provides pure collision detection utility | `checkCollision()` | Nothing | Game rules, state changes, entity ownership |
| [js/score.js](js/score.js#L1-L50) | Owns score state and HUD update | `currentScore`, score display | Nothing | Win logic or state transitions |
| [js/timer.js](js/timer.js#L1-L75) | Owns time countdown and HUD update | `timeRemaining`, timer display | State and game-over trigger | Reset orchestration or entity movement |

---

## 2. Responsibility Boundaries (Allowed vs Forbidden)

| File | Allowed Logic | Forbidden Logic | Data It May Mutate | Data It May Only Read | Allowed Side Effects |
|---|---|---|---|---|---|
| [index.html](index.html#L1-L47) | Screen and DOM layout | Any game logic | None | None | None |
| [style.css](style.css#L1-L254) | Styling and layout | Any JS logic or DOM creation | None | None | Visual only |
| [js/main.js](js/main.js#L1-L105) | System wiring, audio observation, movement gate | Game rules or entity resets | Audio flags (`isMuted`, `lastGameState`) | `gameState` via `getGameState()` | Audio play/pause and toggle UI |
| [js/game-state.js](js/game-state.js#L1-L77) | State transitions and screen visibility | Movement or collision decisions | `gameState`, result text | None | Screen visibility, result message |
| [js/player.js](js/player.js#L1-L147) | Player movement and push attempts | Global state changes | Player `x/y` | Box getters, collision utility | DOM position updates |
| [js/box.js](js/box.js#L1-L128) | Box movement when pushed | Win/loss logic | Box `x/y` | Movement approval | DOM position updates |
| [js/goal.js](js/goal.js#L1-L60) | Win check and win trigger | Screen switching or movement | `goalReached` | Box element | Trigger game over + score increment |
| [js/obstacles.js](js/obstacles.js#L1-L356) | Hazard spawning, movement, hazard collisions | Player input or state ownership | Cones/persons arrays, guard flags | `gameState` via `getGameState()` | DOM creation/removal, game-over trigger |
| [js/collision.js](js/collision.js#L1-L48) | Pure collision math | Any side effects or state | None | DOM rects | None |
| [js/score.js](js/score.js#L1-L50) | Score updates | Win/loss logic | `currentScore` | None | HUD text update |
| [js/timer.js](js/timer.js#L1-L75) | Countdown and time-based loss | State transitions other than trigger | `timeRemaining` | `gameState` via `getGameState()` | HUD text update, trigger game over |

---

## 3. Why These Files Are Split This Way

- **No engine file:** The game is intentionally explicit; each system is small and single-purpose instead of hidden in a central engine ([js/main.js](js/main.js#L1-L105)).
- **Entities are separate:** Player, box, goal, and obstacles each own their own data and rules, preventing cross‑file mutation ([js/player.js](js/player.js#L1-L147), [js/box.js](js/box.js#L1-L128), [js/goal.js](js/goal.js#L1-L60), [js/obstacles.js](js/obstacles.js#L1-L356)).
- **Utilities are isolated:** Collision logic is pure and shared, so game rules stay outside it ([js/collision.js](js/collision.js#L1-L48)).
- **State is centralized:** Screen switching and state transitions live in one place to avoid scattered control flow ([js/game-state.js](js/game-state.js#L1-L77)).
- **UI is not logic:** HTML and CSS define presentation only; gameplay lives in JS files ([index.html](index.html#L1-L47), [style.css](style.css#L1-L254)).

---

## 4. Common File‑Level Failure Modes (What Breaks the Architecture)

| Failure Mode | Why It Breaks | What Exists Instead |
|---|---|---|
| Putting game logic in [index.html](index.html#L1-L47) | Blurs UI and logic boundaries | UI structure only; logic stays in JS |
| Adding state to entity files | Creates multiple sources of truth | State remains centralized [js/game-state.js](js/game-state.js#L24-L61) |
| Adding helpers to [js/collision.js](js/collision.js#L1-L48) | Turns utility into a rule engine | Collision remains pure and stateless |
| Mixing UI updates into gameplay systems | Side effects become controllers | UI updates stay in their own systems |
| Importing entities into utilities | Creates circular ownership | Utilities import nothing and stay pure |

---

## Summary (Beginner‑Friendly Mental Model)

- **Each file has one job.**
- **Files are boundaries, not buckets.**
- **Only the owner mutates its data.**
- **UI files show; systems decide; utilities compute.**

If these boundaries stay intact, the architecture stays readable and safe to extend.