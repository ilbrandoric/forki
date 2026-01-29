# Collision Model & Decision Authority

## 1. Collision Detection vs Collision Decision (Core Split)

This is the most important concept in the collision system: **detection and decision are not the same thing**.

### Collision Detection (Geometry)

Collision **detection** is purely geometric—asking the question: "Are two rectangles overlapping?"

- Rectangle A (player): left=50, top=50, width=30, height=30
- Rectangle B (goal): left=300, top=200, width=100, height=60
- Question: Do they overlap?
- Answer: Yes or No (no side effects, no rules)

This lives in **collision.js**. It is a pure utility function that returns boolean.

### Collision Decision (Game Rules)

Collision **decision** is the game rule—asking the question: "What should happen now?"

- If player and goal overlap, should the player win? Yes.
- If player and person overlap, should the player die? Yes.
- If box and person overlap, should the game end? Yes.

These decisions live **scattered across the codebase** because each system that cares about collisions makes its own decisions.

### Why They Are Separate

Separation prevents several problems:

**Problem 1: Who Decides?**
If collision.js both detects *and* decides, it becomes a god object. collision.js would have to know about all game rules, all entities, all outcomes. Impossible to reason about.

**Problem 2: Rule Changes**
If the rule "person collision = game over" lives in collision.js, you have to edit collision.js to change game logic. Fragile and hard to find.

**Problem 3: Multiple Reactions**
What if a collision should have multiple effects? For example, if rat collides with player, we want to:
1. Trigger game over
2. Play a sound (if audio system exists)
3. Log the event

If collision.js decides everything, it has to know about all these systems.

**Solution**: collision.js detects. Systems that care about detection results make their own decisions. obstacles.js calls `checkCollision()` and then calls `triggerGameOver()`. Clean separation.

---

## 2. Shared Collision Utility (Single Source of Truth)

There is one collision detection function in collision.js:

```
checkCollision(element1, element2) → boolean
```

### What It Does

Uses AABB (Axis-Aligned Bounding Box) algorithm:
- Gets bounding rectangles for both DOM elements
- Checks if rectangles overlap in 2D space
- Returns true if overlapping, false if not

### What It Is Used For

Every collision detection in the game uses this function:

| Caller | What They Check | Decision |
|--------|-----------------|----------|
| player.js | Player vs Box | Try to push (internal calculation) |
| goal.js | Box vs Drop Zone | Call `incrementScore()` and `triggerGameOver("You won!")` |
| obstacles.js | Person vs Player | Call `triggerGameOver("Game Over!")` |
| obstacles.js | Person vs Box | Call `triggerGameOver("Game Over!")` |
| obstacles.js | Rat vs Player | Call `triggerGameOver("Game Over!")` |

### What It Is NOT Used For

These collisions do NOT use the utility function:

| Collision | Why | Alternative |
|-----------|-----|--------------|
| Player vs Cones | Checked before movement, not AABB | `canMove()` in main.js checks position against conePositions array |
| Box vs Cones | Checked before movement, not AABB | `canMove()` in main.js checks position against conePositions array |
| Person vs Cones | Checked before movement | `checkPositionAgainstCones()` in obstacles.js checks array |
| Person vs Boundary | Checked before movement | Explicit `outOfBounds` check in obstacles.js |
| Rat vs Boundary | Checked before movement | Explicit bounds check in rat.js |

**Key insight**: Blocking collisions are checked *before* movement happens (prevention). Terminal collisions are checked *after* movement happens (consequence).

### Assumptions

`checkCollision()` assumes:
- Both elements exist in the DOM
- Both elements have valid bounding rectangles
- No special cases (it is pure AABB)

It does **not**:
- Check if entities are "active" (state gating is done by caller)
- Prevent anything (it just reports)
- Have side effects (it just returns boolean)
- Understand game rules (caller interprets the result)

### Who Can Use It

**Allowed to call**:
- Any system that needs to know if two rectangles overlap
- goal.js, obstacles.js, player.js (internal calculation)

**Must not do**:
- Duplicate the logic elsewhere
- Reimplement collision checking
- Add "physics" into collision checking

---

## 3. Who Is Allowed to Check Collisions

Collision checking is distributed—different systems check different collisions—but only **moving systems** check collisions.

### Moving Systems (Active Checkers)

These systems initiate collision checks:

#### Player (player.js)
- Checks: itself vs box (inline, not using utility)
- Checks: itself vs cones (via `canMove()` in main.js)
- Checks: itself vs goal (calls `checkGoal()` after movement)
- **Authority**: Player owns box collision logic (push mechanics)

#### Box (box.js)
- Checks: itself vs cones (via `canMove()` in main.js)
- **Authority**: Box does not own any consequences; it just calculates pushability

#### Obstacles (obstacles.js)
- Checks: persons vs cones (via `checkPositionAgainstCones()`)
- Checks: persons vs boundaries (via explicit bounds check)
- Checks: persons vs player (via `checkCollision()`)
- Checks: persons vs box (via `checkCollision()`)
- Checks: rat vs boundaries (implicitly, calls cleanup if expired)
- Checks: rat vs player (via `checkCollision()`)
- **Authority**: obstacles.js owns all consequences for moving hazards

### Static Systems (Passive Checkers)

These systems do NOT initiate collision checks. They are checked *by* moving systems:

#### Goal (goal.js)
- Does NOT check itself
- Is checked by player (who calls `checkGoal()`)
- **Authority**: goal.js owns the win condition (what happens when goal is reached)

#### Cones (obstacles.js)
- Do NOT check anything
- Are checked by player, box, persons (who call blocking checks)
- **Authority**: Cones are inert; they have no authority

#### Rat (rat.js & obstacles.js)
- Does NOT check itself (rat.js has no collision checks)
- Is checked by obstacles.js (which calls `checkCollision()`)
- **Authority**: obstacles.js owns rat collision outcomes

### Why Only Movers Check

Movement creates collisions. A static object cannot collide unless something moves into it. So:

```
Player moves → Player checks if it can move → Player detects collision → Player reacts
Obstacle moves → Obstacle updates position → Obstacle checks collisions with player/box
Goal never moves → Never checks anything → Waits to be checked by player
```

This prevents duplicate checking (goal does not check itself *and* player checks it).

---

## 4. Who Is Allowed to Decide Outcomes (Authority)

Detecting a collision is one thing. **Deciding what happens** is another.

Authority is distributed by consequence type:

### Movement Blocking (Checked Before Movement)

| Collision | Who Checks | Who Decides |
|-----------|-----------|------------|
| Player vs Cones | main.js `canMove()` | main.js (returns boolean) |
| Box vs Cones | main.js `canMove()` | main.js (returns boolean) |
| Person vs Cones | obstacles.js `checkPositionAgainstCones()` | obstacles.js (bounces direction) |
| Person vs Boundary | obstacles.js (explicit bounds) | obstacles.js (bounces direction) |

**Key**: The system that checked the collision *decides* what to do (block, bounce, revert position).

### Terminal Collisions (Checked After Movement)

| Collision | Who Checks | Who Decides |
|-----------|-----------|------------|
| Box vs Goal | goal.js via `checkCollision()` | goal.js calls `triggerGameOver("You won!")` |
| Player vs Person | obstacles.js via `checkCollision()` | obstacles.js calls `triggerGameOver("Game Over!")` |
| Box vs Person | obstacles.js via `checkCollision()` | obstacles.js calls `triggerGameOver("Game Over!")` |
| Player vs Rat | obstacles.js via `checkCollision()` | obstacles.js calls `triggerGameOver("Game Over!")` |

**Key**: The system that checked the collision *decides* to trigger game over.

### Side Effects (Observed Outcomes)

Some systems observe the decisions made by checkers:

| Outcome | Who Decides | Who Reacts |
|---------|------------|-----------|
| Goal reached | goal.js (calls `triggerGameOver()`) | score.js (calls `incrementScore()` first) |
| Game over triggered | goal.js / obstacles.js / timer.js | game-state.js (changes state, shows screen) |

**Key**: Trigger functions (`triggerGameOver()`, `incrementScore()`) are the decision points. The caller decides *when* to call them.

### Who Is FORBIDDEN

Entities are **forbidden** from:
- ❌ Changing game state directly
- ❌ Deciding other entities' fates (only trigger functions)
- ❌ Blocking their own checking (you check yourself)
- ❌ Duplicating outcome logic

---

## 5. Collision Types (Conceptual)

The game uses different collision types for different purposes:

### Type 1: Blocking Collision (Movement-Preventing)

**What**: Prevents movement before it happens

**When checked**: Before applying position change

**By whom**: The moving system

**Example**: Player presses up arrow, calculates new position, checks if blocked by cones, reverts position if blocked

**Outcome**: Movement is prevented; nothing happens in game state

**Systems**:
- Player vs Cones (checked in event handler)
- Box vs Cones (checked before push)
- Person vs Cones (checked in 50ms loop)
- Person vs Boundary (checked in 50ms loop)

### Type 2: Terminal Collision (Game-Ending)

**What**: Ends the game immediately

**When checked**: After movement has happened

**By whom**: The hazard's loop or the entity being checked

**Example**: Person moves, then obstacles.js checks if person touched player, then triggers game over

**Outcome**: Game state changes to `"gameOver"`, screen shows result

**Systems**:
- Player vs Person (checked by obstacles.js)
- Box vs Person (checked by obstacles.js)
- Player vs Rat (checked by obstacles.js)

### Type 3: Success Collision (Win Condition)

**What**: Completes the objective

**When checked**: After movement has happened

**By whom**: player.js (by calling `checkGoal()`)

**Example**: Player moves box, box reaches goal, goal.js checks collision, increments score, triggers game over with "You won!"

**Outcome**: Game state changes to `"gameOver"` with win message

**Systems**:
- Box vs Goal (checked by goal.js)

### Type 4: Neutral Collision (No Outcome)

**What**: Collision with no game effect

**When checked**: Not checked; collision is not relevant

**Example**: Would occur if you had multiple boxes and they overlapped

**Outcome**: None

**Systems**: None exist in current game

---

## 6. Common Collision Architecture Failures (Guardrails)

Understanding these prevents Copilot from breaking the collision system:

### Failure 1: Entity Decides Its Own Death

**The mistake**:
```
Person.js: if (checkCollision(myself, player)) {
  myself.die()
}
```

**Why it seems reasonable**: Person detects collision with player, person should react.

**Why it breaks the architecture**: Now death logic lives in person.js. If you want to change what happens when person hits player, you edit person.js. But the same collision triggers game over, so you also edit obstacles.js. Logic is scattered.

**Correct pattern**: obstacles.js centralizes all person outcomes:
```
if (checkCollision(person, player)) {
  triggerGameOver("Game Over!")
}
```

One place, clear authority.

---

### Failure 2: collision.js Triggers Game Over

**The mistake**:
```
collision.js:
export function checkCollision(el1, el2) {
  if (overlap) {
    triggerGameOver()  // ❌ collision.js should not know about game state
    return true
  }
  return false
}
```

**Why it seems reasonable**: If collision detected, game should end.

**Why it breaks the architecture**: collision.js now knows about game state. collision.js now has side effects. What if you want a collision that *doesn't* end the game? You have to edit collision.js. It becomes a god object.

**Correct pattern**: collision.js only detects:
```
export function checkCollision(el1, el2) {
  return (overlap)  // ✓ pure, no side effects
}
```

Caller decides outcome.

---

### Failure 3: Duplicating Collision Checks

**The mistake**:
```
player.js: checkCollision(player, goal)
goal.js: checkCollision(goal, player)
```

Same check, two places. Bug if one is updated but not the other.

**Correct pattern**: One place checks, one place decides:
```
player.js: calls checkGoal()
goal.js:   checkGoal() calls checkCollision(box, goal)
```

Single source of truth.

---

### Failure 4: Mixing Physics into Collision Detection

**The mistake**:
```
collision.js has functions like:
- applyForce()
- calculateMomentum()
- resolvePhysics()
```

**Why it's wrong**: This is not a physics engine. Movement is grid-based, instant, no momentum.

**Correct pattern**: Collision is pure geometry. Movement is instant. No physics.

---

### Failure 5: Adding a Collision Loop

**The mistake**:
```
// Check all collisions every frame
setInterval(() => {
  for (const entity of entities) {
    for (const other of entities) {
      if (checkCollision(entity, other)) {
        handleCollision(entity, other)
      }
    }
  }
}, 50)
```

**Why it breaks the architecture**: Collisions are now checked everywhere, duplicating checks that already happen elsewhere. Player movement already checks its own collisions. Persons already check themselves.

**Correct pattern**: Each moving system checks its own collisions. No global collision loop.

---

### Failure 6: Checking Collisions Without Gating on State

**The mistake**:
```
obstacles.js:
// No state check, runs always
if (checkCollision(person, player)) {
  triggerGameOver()  // Player can die on start screen
}
```

**Why it breaks the architecture**: Collisions trigger game state changes outside of playing. Player dies during start screen, which makes no sense.

**Correct pattern**: Collision checks live inside state-gated loops:
```
setInterval(() => {
  if (getGameState() !== "playing") return  // ✓ state check first
  
  if (checkCollision(person, player)) {
    triggerGameOver()
  }
}, 50)
```

State gates collision consequences.

---

## Summary: Collision Authority Map

```
COLLISION DETECTION (Geometry):
  collision.js
    ↓
  checkCollision(el1, el2) → boolean
    ↓
  Used by: goal.js, obstacles.js, player.js (inline)

COLLISION DECISION (Game Rules):
  
  BLOCKING:
    Player movement → canMove() checks → player.js decides block/allow
    Box movement → canMove() checks → box.js decides block/allow
    Person movement → checkPositionAgainstCones() → obstacles.js bounces
  
  TERMINAL:
    Box vs Goal → goal.js checks and calls triggerGameOver("You won!")
    Person vs Player → obstacles.js checks and calls triggerGameOver()
    Person vs Box → obstacles.js checks and calls triggerGameOver()
    Rat vs Player → obstacles.js checks and calls triggerGameOver()
  
  OBSERVATIONS:
    Goal reached → goal.js calls incrementScore() (before game over)
    Game over → game-state.js handles screen transition

COLLISION AUTHORITY BOUNDARIES:

System              Can Check    Can Decide           Cannot Do
collision.js        geometry     (none)               decide outcomes
player.js           player       block/allow/push     trigger game over
box.js              box          block/allow/push     trigger game over
goal.js             box vs goal  win condition        block movement
obstacles.js        persons      bounce/game over     affect other systems
main.js             player/box   block/allow          trigger outcomes
game-state.js       (none)       state changes        check collisions
```

When adding new collision logic, ask:
1. **What am I checking?** (two entities)
2. **Where is it detected?** (detection lives here)
3. **What happens?** (decision is separate)
4. **Who decides that?** (outcome lives in one place)
5. **Does state gate it?** (is it inside a state check?)

Detection and decision are partners. Keep them separate but coordinated.
