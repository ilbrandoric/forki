# Data Flow & Ownership Model

## Scope (Existing Behavior Only)

This document is grounded in:
- [js/game-state.js](js/game-state.js#L1-L77)
- [js/main.js](js/main.js#L1-L105)
- [js/player.js](js/player.js#L1-L147)
- [js/box.js](js/box.js#L1-L128)
- [js/goal.js](js/goal.js#L1-L60)
- [js/score.js](js/score.js#L1-L50)
- [js/timer.js](js/timer.js#L1-L75)
- [js/obstacles.js](js/obstacles.js#L1-L356)
- [js/collision.js](js/collision.js#L1-L48)

No data structures or ownership rules are invented beyond these files.

---

## 1. Data Categories (Canonical)

The game’s data falls into five categories. Each category has different ownership rules.

| Category | What It Covers | Examples | Ownership Rule |
|---|---|---|---|
| **State data** | Game phase / run status | `gameState` | Owned by the state system only; read by others [js/game-state.js](js/game-state.js#L24-L61) |
| **Entity data** | Positions and DOM references | Player position `x/y`, box position `x/y`, persons array | Owned by the entity/system that moves or manages it [js/player.js](js/player.js#L46-L147), [js/box.js](js/box.js#L41-L128), [js/obstacles.js](js/obstacles.js#L61-L356) |
| **Derived data** | Calculations from live positions | Collision checks, bounds checks | Never stored as global state; computed when needed [js/collision.js](js/collision.js#L37-L47), [js/player.js](js/player.js#L93-L135) |
| **Display data** | Text shown to the player | Timer text, score text, result text | Owned by the system that controls the display, never drives game logic [js/timer.js](js/timer.js#L42-L63), [js/score.js](js/score.js#L36-L50), [js/game-state.js](js/game-state.js#L63-L66) |
| **Configuration data** | Fixed numbers / timing values | Movement speeds, cone count, interval timing | Defined where used; not mutated at runtime [js/player.js](js/player.js#L50-L51), [js/box.js](js/box.js#L45-L46), [js/obstacles.js](js/obstacles.js#L54-L59), [js/timer.js](js/timer.js#L40-L63), [js/main.js](js/main.js#L85-L103) |

---

## 2. Data Ownership Table (Single Source of Truth)

| Data Name | Where It Lives | Owner | Who May Mutate | Who May Read | When It Changes |
|---|---|---|---|---|---|
| `gameState` | [js/game-state.js](js/game-state.js#L24-L61) | State system | `showScreen()` only | Any system via `getGameState()` | On screen transitions |
| `resultTextNode.textContent` | [js/game-state.js](js/game-state.js#L63-L66) | State system | `triggerGameOver()` | UI only | On game over |
| Player position `x/y` | [js/player.js](js/player.js#L46-L147) | Player system | Player key handler, `resetPlayer()` | Player only | On keypress or reset |
| Box position `x/y` | [js/box.js](js/box.js#L41-L128) | Box system | `pushBox()`, `resetBox()` | Player (via getters) | When pushed or reset |
| `goalReached` | [js/goal.js](js/goal.js#L39-L60) | Goal system | `checkGoal()`, `resetGoal()` | Goal only | On win or reset |
| `currentScore` | [js/score.js](js/score.js#L33-L50) | Score system | `incrementScore()`, `resetScore()` | Score only | On goal reached or reset |
| `timeRemaining` | [js/timer.js](js/timer.js#L37-L75) | Timer system | Timer interval, `resetTimer()` | Timer only | Every second during play or reset |
| `conesInitialized` / `personsInitialized` | [js/obstacles.js](js/obstacles.js#L48-L259) | Obstacles system | Obstacles loop | Obstacles only | When entering/leaving play |
| `conePositions` | [js/obstacles.js](js/obstacles.js#L57-L141) | Obstacles system | Obstacles initialization/cleanup | Obstacles and `main.js` via `isPositionBlockedByCones()` | On play start/end |
| `persons` array | [js/obstacles.js](js/obstacles.js#L61-L327) | Obstacles system | Obstacles loop | Obstacles only | On play start/end and each tick |
| `failureTriggered` | [js/obstacles.js](js/obstacles.js#L45-L353) | Obstacles system | Obstacles loop | Obstacles only | On first collision or cleanup |
| `isMuted` / `lastGameState` | [js/main.js](js/main.js#L66-L103) | Audio system | Audio toggle + monitor loop | Audio system only | On user toggle or state change |
| `bgm` audio object | [js/main.js](js/main.js#L60-L99) | Audio system | Audio system only | Audio system only | Play/pause in response to state |

**Key boundary:** Only the owning system mutates its data. Other systems may read via exported accessors or by calling the owner’s functions.

---

## 3. Mutation Rules (Non‑Negotiable)

1. **Only the owner may mutate data.**
   - Example: Only the timer system updates `timeRemaining` [js/timer.js](js/timer.js#L42-L75).
2. **Mutation only happens during allowed states.**
   - Example: Timer decrements only when `gameState === "playing"` [js/timer.js](js/timer.js#L42-L52).
3. **Derived data is never stored.**
   - Collision checks return booleans and are not saved as global state [js/collision.js](js/collision.js#L37-L47).
4. **UI never mutates game data.**
   - UI buttons call state transitions or reload, not direct mutations [js/game-state.js](js/game-state.js#L69-L76).
5. **Entities never mutate global state directly.**
   - Entities trigger outcomes through `triggerGameOver()` rather than changing `gameState` themselves [js/game-state.js](js/game-state.js#L63-L66), [js/goal.js](js/goal.js#L42-L49).

These rules prevent cross‑file mutation and keep the system predictable.

---

## 4. Data Flow Direction (One‑Way Arrows)

The allowed flow is one-way and top‑down:

$$
\text{state} \rightarrow \text{systems} \rightarrow \text{entities} \rightarrow \text{UI}
$$

Examples grounded in code:
- State changes in [js/game-state.js](js/game-state.js#L32-L61) → audio system reacts in [js/main.js](js/main.js#L85-L103).
- Entity movement triggers a goal check → goal system decides win → UI message updates via `triggerGameOver()` [js/goal.js](js/goal.js#L42-L49), [js/game-state.js](js/game-state.js#L63-L66).

The reverse direction is forbidden: UI does not change rules, and side effects do not control state.

---

## 5. Live Data vs Snapshots (Critical Distinction)

**Live data (read fresh each time):**
- DOM geometry (`getBoundingClientRect()`) used for collisions and bounds [js/collision.js](js/collision.js#L37-L47), [js/player.js](js/player.js#L58-L109).
- Current state via `getGameState()` [js/game-state.js](js/game-state.js#L27-L29).

**Safe snapshots (local and short‑lived):**
- `oldX/oldY` used for rollback in player movement [js/player.js](js/player.js#L69-L127).

**Dangerous to cache globally:**
- Collision results and bounding rectangles; they change whenever entities move.

**Why this matters:** caching live data creates stale decisions and desynchronizes collisions, bounds, and UI.

---

## 6. Common Data Corruption Failures (What Breaks the Architecture)

| Failure Mode | Why It Breaks | What Exists Instead |
|---|---|---|
| Storing collision results | Results become stale as entities move | Compute collisions on demand [js/collision.js](js/collision.js#L37-L47) |
| Caching `gameState` inside entities | Entities drift from the source of truth | Read through `getGameState()` when needed [js/game-state.js](js/game-state.js#L27-L29) |
| Copying positions into new globals | Positions diverge from the owning system | Use getters or live values from the owner [js/box.js](js/box.js#L53-L65) |
| Letting UI store game data | UI becomes a controller | UI only reflects outputs [js/score.js](js/score.js#L36-L50), [js/timer.js](js/timer.js#L42-L63) |
| Duplicating counters/timers | Multiple sources of truth desync | Single `currentScore` and `timeRemaining` owners [js/score.js](js/score.js#L33-L50), [js/timer.js](js/timer.js#L37-L75) |

---

## Summary (Beginner‑Friendly Mental Model)

- **Every piece of data has one owner.**
- **Owners control mutation; everyone else observes.**
- **State flows downward into systems, entities, and UI.**
- **Derived values are computed live, never stored.**

If these rules remain true, the game stays consistent and changes remain safe.