# Reset Logic & Idempotency Model

## Scope (Existing Behavior Only)

This document is grounded in:
- [js/game-state.js](js/game-state.js#L1-L77)
- [js/player.js](js/player.js#L1-L147)
- [js/box.js](js/box.js#L1-L128)
- [js/score.js](js/score.js#L1-L50)
- [js/timer.js](js/timer.js#L1-L75)
- [js/goal.js](js/goal.js#L1-L60)
- [js/obstacles.js](js/obstacles.js#L1-L356)
- [js/main.js](js/main.js#L1-L105)

No reset behavior is invented or implied beyond these files.

---

## 1. What “Reset” Means in This Game (Canonical Definition)

In this project, reset means:
- Returning movable entities to known spawn positions.
- Clearing round-specific flags so outcomes can trigger again.
- Restoring HUD values for a fresh run.
- Re-arming round-only systems (like cones/persons) when the state allows it.

Reset does not mean:
- Re-importing modules.
- Re-registering event listeners.
- Re-creating the periodic loops.
- Reloading the page for a standard start.

These behaviors are visible in [js/game-state.js](js/game-state.js#L32-L61) and the individual reset functions in [js/player.js](js/player.js#L140-L147), [js/box.js](js/box.js#L121-L128), [js/score.js](js/score.js#L45-L50), [js/timer.js](js/timer.js#L69-L75), and [js/goal.js](js/goal.js#L56-L60).

---

## 2. Reset Authority (Single Owner)

**Reset authority lives in one place:** `showScreen()` in [js/game-state.js](js/game-state.js#L32-L61).

When `showScreen("playing")` is called, it performs the entire reset sequence:
- Calls `resetPlayer()`, `resetBox()`, `resetScore()`, `resetGoal()`, `resetTimer()`.
- Spawns the rat for the round.
- Then updates `gameState` to `"playing"`.

This makes `showScreen()` the single entry point for resets. Systems do not reset themselves, and UI does not call reset functions directly. This is visible in [js/game-state.js](js/game-state.js#L32-L61).

---

## 3. Idempotency (Why Reset Is Safe to Call Multiple Times)

Each reset function overwrites state with known values instead of modifying it incrementally:

| Reset Function | What It Resets | Idempotent Behavior | Source |
|---|---|---|---|
| `resetPlayer()` | Player position | Sets $x=0$, $y=0$ every time | [js/player.js](js/player.js#L140-L147) |
| `resetBox()` | Box position | Sets $x=100$, $y=100$ every time | [js/box.js](js/box.js#L121-L128) |
| `resetScore()` | Score count | Sets score back to 0 and updates HUD | [js/score.js](js/score.js#L45-L50) |
| `resetTimer()` | Timer value | Sets time back to 30 and updates HUD | [js/timer.js](js/timer.js#L69-L75) |
| `resetGoal()` | Goal flag | Sets `goalReached` back to false | [js/goal.js](js/goal.js#L56-L60) |

Because each reset sets a fixed value, calling them twice does not accumulate changes or create duplicates. That is the core idempotency model.

---

## 4. Reset Order (Dependency Safety)

The reset sequence happens inside `showScreen("playing")` in this order:

1. **Screen visibility is switched to game screen.**
2. **Entity and HUD resets run:** player, box, score, goal, timer.
3. **Rat is spawned for the round.**
4. **`gameState` is updated to `"playing"`.**

Source: [js/game-state.js](js/game-state.js#L32-L61).

Why this order matters:
- Resets happen before `gameState` becomes `"playing"`, so systems that depend on state see clean values when they begin.
- Audio behavior reacts to state changes, so it starts only after `gameState` changes (observed in [js/main.js](js/main.js#L85-L103)).

---

## 5. What Is *Not* Reset (Intentional Persistence)

These elements persist across rounds and are **not** recreated:

| Persistent Element | Why It Persists | Source |
|---|---|---|
| Event listeners (keyboard, start/restart, audio toggle) | Registered once at module load | [js/player.js](js/player.js#L58-L135), [js/game-state.js](js/game-state.js#L69-L76), [js/main.js](js/main.js#L71-L83) |
| Interval loops (obstacles, timer, audio monitor) | Registered once and gated by state | [js/obstacles.js](js/obstacles.js#L223-L356), [js/timer.js](js/timer.js#L40-L63), [js/main.js](js/main.js#L85-L103) |
| Collision utilities | Pure functions, no state | [js/main.js](js/main.js#L35-L58) |
| DOM containers and screen structure | Defined in HTML and reused | [index.html](index.html#L13-L39) |

Persistence is intentional: the game relies on state-gating rather than rebuilding loops or listeners.

---

## 6. Reset Behavior Inside Long-Running Systems

Some systems reset their **internal round data** when state is not `"playing"`:

- Obstacles clear cones/persons and reset their guards when leaving play, so the next run reinitializes cleanly. This happens inside the 50ms loop in [js/obstacles.js](js/obstacles.js#L223-L245).
- The timer interval is created once but stops itself on `"gameOver"`. Resetting the time value alone does not restart the interval, which is acceptable because restart uses a page reload. See [js/timer.js](js/timer.js#L42-L63).

This is still state-gated and does not invent new reset entry points.

---

## 7. Common Reset Failures (What Breaks the Architecture)

| Failure Mode | Why It Breaks | What Exists Instead |
|---|---|---|
| Resetting inside gameplay loops | Causes mid-run state jumps and hard-to-debug bugs | Resets are centralized in `showScreen("playing")` [js/game-state.js](js/game-state.js#L32-L61) |
| Resetting during `"playing"` | Violates state gating and causes desync | Resets occur during the transition to play |
| Re-creating DOM nodes for player/box | Duplicates entities and breaks references | Existing nodes are reused and repositioned [js/player.js](js/player.js#L140-L147), [js/box.js](js/box.js#L121-L128) |
| Re-registering intervals | Leads to multiple loops running at once | Loops are registered once and gated by state [js/obstacles.js](js/obstacles.js#L223-L356), [js/timer.js](js/timer.js#L40-L63) |
| Using UI handlers to reset systems directly | Scatters logic and bypasses state authority | UI triggers `showScreen()` or reload only [js/game-state.js](js/game-state.js#L69-L76) |
| Using page reload as the only reset for normal play | Hides lifecycle intent and complicates flow | Standard reset happens on `showScreen("playing")` (initial start), reload is reserved for restart [js/game-state.js](js/game-state.js#L32-L76) |

---

## Summary (Beginner-Friendly Mental Model)

- **Reset is a lifecycle operation, not an incidental side effect.**
- One function owns it: `showScreen("playing")` in [js/game-state.js](js/game-state.js#L32-L61).
- Reset functions are idempotent; they overwrite to known values.
- Long-running loops stay alive and react to state, rather than being recreated.

If this remains true, the game can reliably start a clean round without scattered reset logic.