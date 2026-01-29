# Timing Model & Loop Architecture Documentation

## 1. The Three Timing Models (Canonical)

The game uses three distinct timing mechanisms, each for a specific purpose. They must not be merged:

| Timing Model | Driven By | Frequency | Purpose | Systems |
|--------------|-----------|-----------|---------|---------|
| **Event-Driven** | User keyboard input | Whenever arrow key is pressed | Responsive player movement; movement-blocking collisions | Player (player.js) |
| **Fast Interval** | setInterval(50ms) | 20 times per second | Smooth obstacle movement, hazard collision detection | Obstacles, Cones, Persons, Rat (obstacles.js) |
| **Slow Interval** | setInterval(1000ms) | Once per second | Accurate game timer, timeout detection | Timer (timer.js) |

**Key insight**: Each timing model exists because the problem it solves cannot be solved by the others. Merging them would break the game.

---

## 2. Event-Driven Timing (Player Input)

Player movement is **not polled from a loop**. Instead, it responds instantly to keyboard events.

### How It Works

The player has a `keydown` event listener registered on the document:

- When user presses an arrow key, the listener fires immediately
- The listener calculates the new position
- The listener checks for collisions
- The listener updates the DOM
- Movement is complete — no loop necessary

### Why This Timing Model

**Responsiveness**: If the player had to wait for the next loop iteration to move, there would be perceptible input lag. Events are instant; loops are not.

**No Polling**: The system does not need to constantly check "is the up arrow pressed?" at 60 times per second. It only acts when the user actually presses a key.

**Collision During Movement**: The event handler can calculate the new position, check collisions, and rollback in a single atomic operation — all guaranteed to happen together without being interrupted by other systems.

### What This Loop Cannot Do

Event-driven timing is unsuitable for **continuous motion** (like obstacles moving), because:
- It only fires when input occurs
- Without input, nothing happens
- Obstacles must move even when the player is not pressing keys

### Example: If This Were Loop-Based Instead

**What would break**:
- Movement would be delayed (wait for next iteration)
- Player input would feel sluggish
- Framerate changes would affect responsiveness
- The player might move multiple times per frame if frame rate drops

---

## 3. Fast Interval Loop (Obstacles & Hazards)

The game runs a 50ms interval loop that handles all obstacle and hazard behavior:

### What Runs Every 50ms

1. **State check**: If state is not `"playing"`, clean up and return early
2. **Initialization**: Create cones (once) and persons (once) when entering "playing"
3. **Movement**: Calculate new positions for each person
4. **Collision detection**: Check if persons collide with player or box
5. **Game over**: Trigger game over if collision detected
6. **Rendering**: Update DOM with new person positions
7. **Cleanup**: Remove cones and persons when exiting "playing"

### Why 50ms (20 FPS, Not 60 FPS)

This loop is **not tied to the display frame rate**. It does not use `requestAnimationFrame`. It runs at a fixed 50ms interval regardless of how fast the monitor refreshes.

**Why this is intentional**:
- Gameplay timing is independent of rendering performance
- A 60Hz monitor and a 120Hz monitor have the same game speed
- Framerate drops do not cause the game to slow down or speed up
- Consistency across different devices and browsers

### Frequency Breakdown

- **50ms interval** = 20 updates per second
- This is slow enough to see obstacles move clearly
- This is fast enough for collisions to feel responsive
- This is independent of whether the browser can render 60 or 30 frames per second

### Why This Cannot Be Event-Driven

Obstacles move **continuously** whether the player presses keys or not. They move every 50ms in a loop. Events only fire on input; loops fire on time.

### Why This Cannot Use The 1000ms Timer Loop

The obstacle loop needs to run **20 times per second** for smooth movement. The timer loop runs **once per second**. If they shared a loop, obstacles would move in jerky chunks (one position every 1000ms), making them look frozen and then suddenly jump.

---

## 4. Slow Interval Loop (Timer)

The game runs a 1000ms interval loop (once per second) that counts down the timer:

### What Runs Every 1000ms

1. **State check**: If state is not `"playing"`, return early
2. **Countdown**: Decrement `timeRemaining` by 1
3. **Rendering**: Update the timer display
4. **Game over**: If time reaches 0, trigger game over and stop the interval

### Why 1000ms (Not 50ms or Event-Driven)

**Accuracy**: The timer must be accurate to the second. Using the 50ms loop would accumulate rounding errors. Using events would be impossible (the game does not receive an event when 1 second passes). A dedicated 1000ms interval is the only way to get a reliable, second-accurate countdown.

**Simplicity**: Separating timer logic into its own loop keeps it independent from obstacle timing. The timer does not need to know about obstacles, and obstacles do not need to know about timer accuracy.

### Frequency Breakdown

- **1000ms = 1 second** — one update per second, very slow
- This matches human perception of time
- This allows the timer display to update clearly without flickering
- This is the only way to get a reliable countdown

### Why This Cannot Be 50ms

If the timer decremented every 50ms:
- 1 second = 20 decrements (not 1)
- The timer would count down 20x too fast
- The game would end in 1.5 seconds instead of 30

If the 50ms loop called timer decrement:
- The obstacle system and timer system would be coupled
- Changing obstacle timing would affect timer accuracy
- Adding or removing obstacle features would risk breaking the timer

### Why This Cannot Be Event-Driven

The timer must tick on **time passing**, not on user action. No user event occurs when 1 second elapses. Only a loop running on an interval can detect time passing.

---

## 5. Why These Loops Must Stay Separate (Critical)

This table shows what breaks if the three timing models are merged:

### Merging Event-Driven + 50ms Loop

| If We Did This | What Breaks |
|---|---|
| Move player input into the 50ms loop | Input lag: player has to wait up to 50ms to move |
| Move obstacle logic into event handlers | Obstacles only move when player presses keys; they freeze during player idle time |
| Both into one loop | Obstacles would move in chunks tied to button presses, not smoothly |

**Result**: Game feels sluggish and broken. Obstacles appear frozen. Movement is delayed.

---

### Merging 50ms Loop + 1000ms Loop

| If We Did This | What Breaks |
|---|---|
| Obstacles run in 1000ms loop | Obstacles move once per second in huge jumps (jerky, unplayable) |
| Timer runs in 50ms loop | Timer counts down 20x per second (game ends in 1.5 seconds instead of 30) |
| Both in one loop | Have to compromise frequency: obstacles move too slowly OR timer is inaccurate |

**Result**: Gameplay is broken. Either obstacles are frozen or the timer is wildly inaccurate.

---

### Stopping/Starting Loops Instead of State Gating

| If We Did This | What Breaks |
|---|---|
| Stop obstacle loop when entering game over | Need to track interval IDs, manage lifecycle, risk leaving loops running after shutdown |
| Start fresh loops on each game | Memory leaks from old intervals not being cleared, multiple intervals running simultaneously |
| Recreate listeners on each game | Same problem: old listeners not removed, multiple handlers on same event |

**Result**: Memory leaks, performance degradation, unpredictable behavior. Safer to keep loops running and gate behavior with state.

---

### Using requestAnimationFrame Instead of Intervals

| If We Did This | What Breaks |
|---|---|
| Obstacle loop uses rAF (tied to monitor refresh) | Game speed changes on different monitors (60Hz vs 144Hz vs 30Hz) |
| Timer uses rAF | Timer tick rate varies with frame rate; counting becomes inaccurate |
| Player movement uses rAF | Input is tied to frame rate; lower FPS means lower responsiveness |

**Result**: Game plays differently on different devices. Not portable. Timing is non-deterministic.

---

## 6. Timing + State Interaction

State gates **behavior**, not **time**. This is critical to understand:

### Time Always Flows

All three loops **run continuously from module load to page unload**:

- Player keyboard listener is always registered
- 50ms obstacle loop always runs every 50ms
- 1000ms timer loop always runs every 1000ms

They never start or stop.

### Behavior Is Gated, Not Time

When state is not `"playing"`, the loops still run, but they **exit early** without doing behavior:

```
Event handler fires           → Check state        → If not "playing", exit → No movement
50ms loop iteration runs      → Check state        → If not "playing", exit → No obstacle movement
1000ms loop iteration runs    → Check state        → If not "playing", exit → No timer countdown
```

### Time Does Not Pause

If time passed while the game was in `"start"` or `"gameOver"` state:
- The 50ms interval still fires 20 times
- The 1000ms interval still fires once per second
- But no behavior runs (loops return early)

This is intentional. It means:
- No complex "pause/resume" logic
- No tracking of elapsed time separately
- No risk of time skipping when transitioning states
- Simpler, more robust code

### Resets Do Not Recreate Loops

When transitioning to `"playing"`:

- `resetPlayer()` is called — resets position state, does not touch the keyboard listener
- `resetTimer()` is called — resets countdown value, does not restart the interval
- Reset functions only reset data, not the loop infrastructure

The loops already exist and keep running. Reset just fixes the state variables they use.

---

## Timing Dependency Diagram

```
MODULE LOAD (everything registered)
    ↓
Keyboard listener ready
    ↓
50ms loop registered
    ↓
1000ms loop registered
    ↓
State changes to "playing"
    ↓
Keyboard events now cause movement
    ↓
50ms loop now updates obstacles (was gated by state check)
    ↓
1000ms loop now counts down (was gated by state check)
    ↓
Player presses arrow key
    ↓
Event fires → Movement → Collision check → Rendering
    ↓
50ms loop fires independently → Person moves → Rendering
    ↓
1000ms loop fires independently → Time decrements → Rendering
    ↓
(All three systems run independently and in parallel)
```

---

## Common Timing Bugs (Guardrails)

### Bug 1: Adding a New Feature with a New Loop

**The mistake**:
```
A new system adds setInterval(33ms) for a new feature.
Now there are 4 loops: event-driven, 50ms, 33ms, and 1000ms.
```

**Why it's dangerous**: Loops interact unpredictably. The new feature runs at a different frequency than obstacles. Systems become hard to test and debug.

**How to avoid**: New features should use one of the three existing timing models. Either:
- Add to event-driven (if triggered by input)
- Add to 50ms loop (if continuous during play)
- Add to 1000ms loop (if once-per-second)

If your feature needs a different frequency, question whether it truly needs one, or if it can integrate into an existing loop.

---

### Bug 2: Moving Logic from 50ms to 1000ms for "Optimization"

**The mistake**:
```
Obstacle movement moved from 50ms loop to 1000ms loop to "reduce CPU."
Now obstacles move once per second in jerky chunks.
```

**Why it's dangerous**: Saves minimal CPU but breaks gameplay. Obstacles become unplayable.

**How to avoid**: Each loop's frequency is chosen for a reason. Do not change frequency without understanding the consequence on player experience.

---

### Bug 3: Stopping the 50ms Loop on Game Over

**The mistake**:
```
When gameOver is triggered, clearInterval(obstacleLoopId) is called.
```

**Why it's dangerous**: Now the 50ms loop is not running during "start" state. On restart, the interval needs to be recreated. This is fragile and error-prone.

**Better approach**: Keep the loop running. Let state gating handle behavior control.

---

### Bug 4: Checking getGameState() Only Once Per Loop

**The mistake**:
```
At the start of the 50ms loop:
if (getGameState() !== "playing") return

Then, inside the loop:
  Assume state is "playing"
  Do obstacle movement
```

**Why it's dangerous**: If state changes mid-loop (unlikely but possible), the system is reading old state.

**Better approach**: State check at the top is sufficient for this architecture because:
- State transitions are atomic (happen all at once)
- Systems do not have long-running operations that span multiple loop iterations

---

### Bug 5: Using Events for Continuous Behavior

**The mistake**:
```
Try to move obstacles by listening to a "tick" event.
No such event exists in browsers; create a custom event.
Emit the event in the 50ms loop.
Listener runs on the event.
```

**Why it's dangerous**: Adds unnecessary indirection. You now have:
- A 50ms loop
- An event emission
- An event listener
- Three layers instead of one

**Better approach**: Run logic directly in the loop.

---

## Summary: Three Timing Models, Three Purposes

```
INPUT               TIME-BASED        TIME-BASED
Event-driven        Fast Interval     Slow Interval
(Keyboard)          (50ms)            (1000ms)

Player movement     Obstacle movement  Timer countdown
Instant response    Smooth animation   Accurate tracking
Responsive          Visual            Temporal
                    (gameplay rhythm)  (game pacing)

Cannot replace      Cannot replace     Cannot replace
others              others             others
```

When building new features, ask:
1. **Is this triggered by input?** → Event-driven
2. **Does this need smooth motion?** → 50ms loop
3. **Is this once per second?** → 1000ms loop
4. **State gates all behavior** — no loop runs behavior outside "playing"
