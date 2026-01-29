# Screen System & UI Flow

## Scope (Existing Behavior Only)

This document is grounded in:
- [index.html](index.html#L1-L47)
- [js/game-state.js](js/game-state.js#L1-L77)
- [js/main.js](js/main.js#L1-L105)
- [js/score.js](js/score.js#L1-L50)
- [js/timer.js](js/timer.js#L1-L75)

No screens or UI behavior are invented. Screens are views, not controllers.

---

## 1. Screen List (Canonical Views)

The game has exactly three screens defined in the HTML. Only these exist.

| Screen | Purpose | When Visible | State That Activates It | What It Must Never Control |
|---|---|---|---|---|
| `#start-screen` | Waiting state for the player to begin | On initial load and after a full page reload | `"start"` (initial state) | Must not start gameplay systems or reset entities directly |
| `#game-screen` | Active play HUD + world | During active play | `"playing"` | Must not decide win/loss or trigger resets on its own |
| `#game-over-screen` | End-of-run summary and restart option | After a win or loss | `"gameOver"` | Must not alter game state or reset entities directly |

Source of screen structure: [index.html](index.html#L13-L39).

---

## 2. Screen Switching Mechanism (Centralized)

All screen visibility is controlled by a single function: `showScreen()` in [js/game-state.js](js/game-state.js#L32-L61).

**How it works:**
- It hides all screens by adding the `hidden` class.
- It then shows exactly one screen based on the state name.
- It sets `gameState` to the chosen screen name.

**Why this is centralized:**
- Only one place decides which screen is visible.
- Screen visibility is always consistent with `gameState`.
- UI never bypasses or replaces state transitions.

**State-triggered visibility:**
- `start` → start screen visible
- `playing` → game screen visible
- `gameOver` → game over screen visible

These transitions are triggered by `showScreen()` calls, not by DOM elements themselves. See [js/game-state.js](js/game-state.js#L32-L71).

---

## 3. UI Elements as Observers (Not Drivers)

UI elements observe state or game outcomes and update display only. They do not control game logic.

| UI Element | Where It Lives | What It Observes | What It Is Allowed to Do | What It Must Not Do |
|---|---|---|---|---|
| Timer display (`#timer`) | [index.html](index.html#L20-L26) + [js/timer.js](js/timer.js#L1-L75) | `getGameState()` and `timeRemaining` | Update text while state is `"playing"` | Trigger state changes directly or reset itself independently |
| Score display (`#score`) | [index.html](index.html#L20-L26) + [js/score.js](js/score.js#L1-L50) | Score mutations via `incrementScore()` and `resetScore()` | Update text when score changes | Decide when scoring happens or call game over |
| Game-over message (`#result-text`) | [index.html](index.html#L36-L38) + [js/game-state.js](js/game-state.js#L63-L66) | `triggerGameOver(reason)` | Display the reason string | Determine win/loss or set state itself |
| Start button (`#start-btn`) | [index.html](index.html#L15-L18) + [js/game-state.js](js/game-state.js#L69-L72) | User click | Signal intent by calling `showScreen("playing")` | Reset systems directly or mutate entities |
| Restart button (`#restart-btn`) | [index.html](index.html#L36-L38) + [js/game-state.js](js/game-state.js#L74-L76) | User click | Signal intent by reloading the page | Manually reset state or clean up DOM |

**Key rule:** UI reflects the current state. It does not decide the state.

---

## 4. Button Logic Boundaries (Intent Only)

Buttons do not own logic. They only signal intent.

### Start Button (`#start-btn`)
- **Allowed:** Call `showScreen("playing")`, which triggers centralized resets and state change.
- **Not allowed:** Call `resetPlayer()`, `resetTimer()`, or any game system directly.

This ensures resets stay centralized in `showScreen()` in [js/game-state.js](js/game-state.js#L32-L52).

### Restart Button (`#restart-btn`)
- **Allowed:** Reload the page (`window.location.reload()`), which reboots the entire game cleanly.
- **Not allowed:** Manually reset state or hide/show screens directly.

This keeps restart logic simple and avoids partial resets. See [js/game-state.js](js/game-state.js#L74-L76).

---

## 5. Screen + State Failure Modes (What Breaks the Architecture)

These failures are common when UI starts to “drive” the game. Each one violates the current design.

| Failure Mode | Why It Breaks | What Should Happen Instead |
|---|---|---|
| UI calls reset functions directly | Resets get scattered and order becomes inconsistent | All resets stay inside `showScreen("playing")` in [js/game-state.js](js/game-state.js#L32-L52) |
| Screens modify `gameState` themselves | State becomes inconsistent and untraceable | Only `showScreen()` updates `gameState` |
| Buttons hide/show screens directly | Visibility and state can diverge | Buttons only signal intent; `showScreen()` handles visibility |
| Game logic inside UI handlers | UI becomes a controller, not a view | Logic stays in systems; UI only reflects results |
| UI-only flags added to manage flow | Creates parallel state and bugs | Use the existing `gameState` only |
| Hiding bugs by toggling visibility | Problems get masked instead of fixed | Fix the underlying state/logic issue, not the screen |

---

## Summary (Beginner-Friendly Mental Model)

- **Screens show. State decides. UI reacts.**
- The only screen switcher is `showScreen()` in [js/game-state.js](js/game-state.js#L32-L61).
- Buttons signal intent; they do not run game logic.
- The timer, score, and game-over message only display what the game already decided.

If this stays true, UI never leaks into game logic, and the architecture remains stable.