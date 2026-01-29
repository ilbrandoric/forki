# Task 31 – Architecture Overview (How the System Fits Together)

## MODE
You are in DOCUMENTATION mode.

You may CREATE or OVERWRITE the file:
- documentation/architecture-overview.md

You must NOT modify any other files.
You must NOT modify JavaScript, HTML, or CSS.
You must NOT add comments to code.
You must NOT refactor anything.
You must NOT invent systems or behavior.

This task is documentation only.

---

## GOAL

Create a human-readable architecture overview that explains **how the game system fits together** at a conceptual level.

This document is the bridge between:
- the README (map)
- the detailed system and entity docs (territory)

A beginner should understand how the parts cooperate *without reading code*.

This document explains:
- what systems exist
- how they communicate
- who owns what responsibility
- when things run
- why the structure is split this way

---

## AUDIENCE

A beginner who:
- understands basic JavaScript
- has never built a game before
- is confused by multiple files
- needs a mental model before reading code

Use simple language.
Explain ideas before naming files.
Do NOT assume architectural knowledge.

---

## REQUIRED SECTIONS (IN ORDER)

### 1. The Big Picture (One Paragraph)
Explain:
- this is a DOM-based game
- the browser is the engine
- no framework is used
- everything runs because of state and time

No file names yet. Just the idea.

---

### 2. The World Model (DOM = World)
Explain:
- the game world is a `<div>` (#game-area)
- entities are DOM elements inside it
- position = style.left / style.top
- movement = changing pixels
- visibility = existence in DOM

This section should help the reader understand:
> “If I can see it, it exists. If it moves, JS moved it.”

No code.

---

### 3. The Boot Flow (How the Game Starts)
Explain at a high level:
- browser loads index.html
- index.html loads main.js
- main.js imports all systems
- systems initialize their state
- game waits for user to press start

Do not list imports.
Do not list functions.
Explain sequence only.

---

### 4. The State Machine (What Runs When)
Explain:
- the game has states (start, playing, gameOver)
- systems check state before running
- state controls lifecycle of entities
- state transitions are the “traffic lights” of the game

Use metaphor if helpful (traffic light, conductor, etc.)

---

### 5. The Timing Model (How Things Move)
Explain the three timing models:
- event-driven (keyboard)
- interval-driven (obstacles loop)
- interval-driven (timer)

Explain:
- why they are separate
- why they are not merged
- what would break if they were

No code. Only reasoning.

---

### 6. The Entity Model (Who Exists)
Explain conceptually:
- Player
- Box
- Goal
- Cones
- Persons
- Rat

Explain:
- entities own their own state
- some move, some don’t
- some are temporary
- some persist
- cleanup matters

Do NOT describe implementation.
Only describe roles.

---

### 7. The Collision Model (Who Decides What)
Explain:
- collision is rectangle-based
- not physics
- movement-blocking vs terminal collisions
- ownership (who checks whom)
- why this avoids duplication

No math. No code.

---

### 8. Why the Files Are Split This Way
Explain:
- separation by responsibility
- why there is no “engine” file
- why no base class exists
- why explicit > abstract
- why clarity > cleverness

This section is philosophical and important.

---

### 9. How to Read the Code (Suggested Order)
Give a reading order:
1. index.html
2. main.js
3. game-state.js
4. player.js
5. obstacles.js
6. collision.js
7. remaining entities

Explain *why* this order works.

---

## STYLE RULES

- No code blocks
- No function names unless unavoidable
- No deep implementation details
- No repetition from README
- Short paragraphs
- Clear headings
- Friendly tone
- Teaching tone
- No marketing language
- No academic tone

---

## OUTPUT

Create or overwrite:
- documentation/architecture-overview.md

Do not output anything else.
Do not modify anything else.

When finished, STOP.
