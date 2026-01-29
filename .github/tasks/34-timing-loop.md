# Task 34 — Timing Model & Loop Architecture Documentation (How Time Drives the Game)

## Goal

Document **how time works in the game**, explaining the different loops, intervals, and event-driven updates, and why they are intentionally separated instead of unified.

This task teaches Copilot that **time is not a single loop**, and that each timing mechanism exists for a specific architectural reason.

---

## Why This Task Is Needed

Timing bugs are the second most common failure after state bugs.

Without clear documentation, Copilot (or a human) will try to:
- merge loops into one
- stop/start intervals instead of gating them
- move logic into requestAnimationFrame
- tie gameplay to frame rate
- make timers drift or desync

This task prevents that by explaining the **three timing models** and why mixing them would break the game.

---

## Scope (Strict)

This task documents **existing timing behavior only**.

It must be derived from:

- `player.js`
- `obstacles.js`
- `timer.js`
- `main.js`
- `game-state.js`

No new loops may be invented.  
No timing refactors may be suggested.  
No code may be written.

---

## What Must Be Documented

### 1. The Three Timing Models (Canonical)

Document the three timing mechanisms used in the game:

1. **Event-driven timing**
2. **Fast interval timing**
3. **Slow interval timing**

For each, explain:
- what drives it
- what systems use it
- what kind of behavior it controls
- why it cannot be replaced by the others

---

### 2. Event-Driven Timing (Player Input)

Explain how keyboard events create **instant, non-loop-based movement**, including:

- why input is not polled
- why responsiveness matters
- how state gates movement
- what breaks if this is loop-driven instead

---

### 3. Fast Interval Loop (Obstacles & Hazards)

Document the 50ms loop used for obstacles:

- what it updates
- what it checks
- what it must never do
- why it runs forever but is gated by state
- why it is not tied to rendering

Explain why this loop is **gameplay rhythm**, not animation.

---

### 4. Slow Interval Loop (Timer)

Document the 1000ms loop used for the timer:

- why it is separate from obstacle timing
- why accuracy matters more than smoothness
- how it drives game-over
- what breaks if it shares a loop with obstacles

---

### 5. Why These Loops Must Stay Separate (Critical)

Provide a table or diagram showing:

- what happens if loops are merged
- what happens if loops are stopped/started
- what happens if loops are frame-based
- what happens if loops ignore state

This section is the guardrail against “optimization” that breaks gameplay.

---

### 6. Timing + State Interaction

Explain how **state gates time**, not the other way around:

- loops always run
- behavior only runs in allowed states
- time does not pause; behavior does
- resets do not recreate loops

This must reinforce the architectural pattern established in Tasks 32–33.

---

## Definition of Done

This task is complete only when:

- A beginner can explain why there are multiple timing systems
- Copilot does not attempt to merge or refactor loops
- The relationship between time and state is explicit
- Each loop’s responsibility is crystal clear
- No code appears anywhere
- All descriptions are grounded in real files and behavior
- The user validates the result

---

## Output Format (Required)

- One markdown file
- Same style and tone as previous `.github/tasks/`
- Diagrams or tables strongly encouraged
- Beginner-friendly language
- Architecture-first, not implementation-first

---

## Reminder (Non-Negotiable)

Time is intentional.  
Loops are not interchangeable.  
State gates behavior, not time.

Copilot documents.  
Copilot does not invent.

Only when the user validates this task may we proceed to Task 35.
