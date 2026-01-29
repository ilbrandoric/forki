# Architecture Overview

## 1. The Big Picture (One Paragraph)
This is a DOM‑based game where the browser is the engine. There is no framework and no hidden runtime. Everything happens because the game keeps track of state and time, and the code decides what should run in each moment.

## 2. The World Model (DOM = World)
The game world is a div with the id #game-area. Every entity you see is a DOM element placed inside it. Position comes from style.left and style.top, so movement is just changing pixels. If it exists in the DOM, it exists in the world; if it moves, JavaScript moved it.

## 3. The Boot Flow (How the Game Starts)
The browser loads index.html, which loads main.js. The main entry pulls in the different systems and lets them set up their initial state. The game then waits for the player to press start before active play begins.

## 4. The State Machine (What Runs When)
The game uses a small set of states such as start, playing, and gameOver. Each system checks the current state before it runs so that only the right things happen at the right time. State transitions act like traffic lights for the game, telling systems when to move, when to pause, and when to stop.

## 5. The Timing Model (How Things Move)
There are three timing models: event‑driven updates for the keyboard, an interval‑driven loop for obstacles, and another interval‑driven loop for the timer. They are separate because they respond to different kinds of input and need different rhythms. If they were merged, player input would feel delayed, obstacles would update at the wrong pace, and the timer could drift or become inconsistent.

## 6. The Entity Model (Who Exists)
The game includes a Player, Box, Goal, Cones, Persons, and Rat. Each entity owns its own state and has a clear role. Some entities move while others are fixed, some are temporary while others persist, and cleanup matters so old elements do not linger after they are no longer needed.

## 7. The Collision Model (Who Decides What)
Collisions are based on simple rectangles rather than physics. Some collisions block movement, while others are terminal and end the run. The moving entity is responsible for checking what it hits, using a shared collision approach so the rules are defined once instead of duplicated across every entity.

## 8. Why the Files Are Split This Way
Files are separated by responsibility so each part is small and readable. There is no single engine file, no base class, and no hidden inheritance tree. The structure favors explicit code over abstraction, and clarity over cleverness, so a reader can follow the flow without guessing.

## 9. How to Read the Code (Suggested Order)
A good reading order is:
1. index.html — to see the world and the entry point.
2. main.js — to see how the game is wired together.
3. game-state.js — to understand the state machine.
4. player.js — to see how input and movement are handled.
5. obstacles.js — to understand how moving hazards are created and updated.
6. collision.js — to see how interactions are decided.
7. the remaining entities — to understand their specific roles.

This order moves from the outer shell to the inner systems, so each file has context when you reach it.
