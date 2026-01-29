# Audio System & Side-Effect Isolation

## Scope (Existing Behavior Only)

This document is grounded in:
- [js/main.js](js/main.js#L1-L105)
- [js/game-state.js](js/game-state.js#L1-L77)
- [js/score.js](js/score.js#L1-L50)
- [js/timer.js](js/timer.js#L1-L75)
- [js/player.js](js/player.js#L1-L147)
- [index.html](index.html#L1-L47)

No side-effect systems are invented beyond these files.

---

## 1. What Counts as a Side Effect (Canonical Definition)

In this game, a **side effect** is anything that **changes presentation or external output** without deciding gameplay outcomes.

**Side effects include:**
- Audio playback (background music).
- UI text updates (timer and score).
- Result message updates (game-over text).

**Side effects do NOT include:**
- State changes.
- Collision decisions.
- Movement or rules.
- Scoring logic (the decision to score, not the display).

The UI elements are defined in [index.html](index.html#L15-L38), while their updates are driven in [js/main.js](js/main.js#L60-L103), [js/score.js](js/score.js#L36-L50), and [js/timer.js](js/timer.js#L42-L63).

---

## 2. Audio System Overview (Observer Only)

The audio system is defined in [js/main.js](js/main.js#L60-L103).

**Initialization:**
- A single `Audio` object is created and configured (source, loop, volume).
- The audio toggle button is read from the DOM (`#audio-toggle-btn`).

**State observation:**
- A 100ms monitor loop reads `getGameState()`.
- When state transitions to `"playing"`, audio starts (if not muted).
- When leaving `"playing"`, audio stops and resets to the beginning.

**Mute handling:**
- Clicking the audio toggle button flips `isMuted` and updates the icon.
- Mute does not change game state; it only affects playback.

**Key rule:** Audio never changes state. It only reacts to state changes. This is visible in [js/main.js](js/main.js#L71-L103).

---

## 3. Side Effects Observe State (One-Way Flow)

The direction of control is **one-way**:

$$
\text{state} \rightarrow \text{side effects}
$$

Never:

$$
\text{side effects} \rightarrow \text{state}
$$

Examples grounded in the code:
- State change to `"playing"` triggers music start (observer loop in [js/main.js](js/main.js#L85-L103)).
- Timer display updates only when `getGameState() === "playing"` (loop in [js/timer.js](js/timer.js#L42-L63)).
- Score display updates when scoring is decided elsewhere (display update in [js/score.js](js/score.js#L36-L50)).

---

## 4. Why Side Effects Are Centralized

Side effects are centralized because it keeps gameplay deterministic and debuggable.

| Centralized Location | Side Effect | Why It Stays Central |
|---|---|---|
| [js/main.js](js/main.js#L60-L103) | Background music | Prevents multiple entities from competing over audio |
| [js/timer.js](js/timer.js#L42-L63) | Timer display | Keeps UI update tied to state gating |
| [js/score.js](js/score.js#L36-L50) | Score display | Avoids duplicate score formatting across systems |
| [js/game-state.js](js/game-state.js#L63-L66) | Result message text | Keeps win/loss messaging tied to game-over transitions |

If every entity triggered its own sound or UI updates, the game would desync, double-play audio, and hide real gameplay bugs behind presentation updates.

---

## 5. Side-Effect Failure Modes (What Breaks the Architecture)

| Failure Mode | Why It Breaks | What Exists Instead |
|---|---|---|
| Audio triggering transitions | Audio becomes a controller | State drives audio, not the reverse [js/main.js](js/main.js#L85-L103) |
| Sound logic placed in entities | Duplicates effects and couples systems | Audio stays in a single system [js/main.js](js/main.js#L60-L103) |
| UI effects mutating state | UI becomes a game controller | UI only reflects state and outcomes [js/game-state.js](js/game-state.js#L63-L66) |
| Side effects inside gameplay loops | Timing dependencies appear | Effects are triggered by state or explicit outcomes |
| Timing loops deciding gameplay | Side effects become authority | State remains the authority [js/game-state.js](js/game-state.js#L24-L61) |

---

## Summary (Beginner-Friendly Mental Model)

- **Audio and UI are reactions, not drivers.**
- **State changes first; side effects respond.**
- The audio system lives in [js/main.js](js/main.js#L60-L103) and only reads state.
- Score, timer, and result text are UI outputs, not rule engines.

If this stays true, side effects stay isolated and gameplay remains stable.