# How the Game Comes to Life: A Step-by-Step Guide to the Boot Flow

## Introduction: The Orchestra Before the Performance

Welcome! As you start exploring this codebase, think of the game's systems like the instruments in an orchestra. When the game first loads, all the musicians take their seats and tune their instruments. The violins are ready, the percussion is set up, and the woodwinds are prepared. Everything is armed and ready to go, but they are all waiting for one thing: a signal from the conductor.

In this game, that signal is the **gameState**. The systems are "tuned up" and ready at load time, but they wait for the state to change from `"start"` to `"playing"` before they start making music.

This document walks through the three distinct phases of this process:

1. The initial handoff from the browser  
2. The "armed but dormant" initialization  
3. The final spark that brings the game to life  

---

## 1. Phase 1: The Browser Handoff

The journey begins the moment a user opens `index.html` in their browser. This is the initial handoff, where the browser prepares the stage and then passes control to the game's JavaScript entry point.

### Step-by-step

1. The browser loads the `index.html` file, which defines the basic structure of the game.
2. The HTML defines three primary screens:
   - `#start-screen`
   - `#game-screen`
   - `#game-over-screen`  
   CSS ensures only the `#start-screen` is visible by default.
3. A `<script>` tag at the very end of the HTML file loads `js/main.js`.  
   This placement guarantees the entire HTML document is ready before any script runs.
4. `js/main.js` acts as the game's true entry point. Its job is to import all other game systems:
   - `player.js`
   - `obstacles.js`
   - `game-state.js`
   - and others
5. As each JavaScript module is imported, its top-level code runs immediately.  
   This is where one-time setup happens (event listeners, intervals, monitors).
6. Once all modules are loaded and initialized, control returns to the browser.

At this point, the game is fully loaded and waiting for the user to act.

> **Key Insight**  
> The game does not start playing when the page loads. It loads and waits.

While the start screen appears idle, most of the game's systems are already armed and prepared under the hood.

---

## 2. Phase 2: Initialization — Armed but Dormant

After the browser handoff, the game enters a fully initialized but inactive state. Systems are running, but intentionally doing nothing until the player clicks **Start**.

### 2.1 What Happens at Load Time?

During the initial module loading sequence triggered by `main.js`, several key systems perform one-time setup:

- **game-state.js**  
  Sets the initial game state to `"start"`.

- **player.js**  
  Sets the player's initial position and attaches keyboard listeners.

- **obstacles.js**  
  Registers its 50ms interval loop (runs continuously).

- **timer.js**  
  Registers its 1000ms interval loop (runs continuously).

- **main.js**  
  Registers the audio system’s state monitoring loop.

### 2.2 The "Armed but Dormant" Principle

The core architectural idea is simple:

> Systems are armed (loaded and running) but dormant (waiting for state).

Every system that runs on a timer or responds to input first checks the current game state.  
If the state is not `"playing"`, it exits immediately.

| Armed (Ready to Go)             | Dormant (Waiting for the Signal) |
|---------------------------------|----------------------------------|
| 50ms obstacle loop is running   | Obstacles and cones are not created or moved |
| 1000ms timer loop is running    | Timer does not count down |
| Keyboard listeners are active   | Player cannot move |
| Audio monitor is running        | Background music does not play |

### 2.3 The Waiting State

After initialization:

- `gameState` is `"start"`
- Only the start screen is visible
- All systems are ready, but frozen

> **Key Insight**  
> The game is loaded and armed, but frozen in state.  
> This prevents accidental behavior and gives control to the player.

This pause is intentional. It sets the stage for the final phase, where one click brings the entire system to life.

---

## 3. Phase 3: The Spark — Transition to Active Play

The transition to active play is triggered by a single event: the player clicking **Start**.

### 3.1 The Click That Starts Everything

The click listener’s sole responsibility is to call:

