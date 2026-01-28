# 🚀 JS DOM Game Rapid Prototyping 

## PHASE 1 — Define the MVP (15 minutes)

MVP Game Overview (Rewritten)

Forki (MVP) is a single-player game where the player controls a forklift and must deliver one box to a highlighted drop zone before the timer runs out, while avoiding one type of moving obstacle. If the forklift collides with an obstacle or time reaches zero, the game ends.

That’s it.
This is buildable in 1–2 sessions.

PHASE 1 — Final MVP Definition
1. Player action (MVP)

The player moves the forklift with arrow keys to carry a box to a drop zone while avoiding obstacles.

2. Win condition (MVP)
The player wins by successfully dropping the cargo (box) in the target zone before the timer reaches zero.

3. Lose condition (MVP)
The player loses if they collide with an obstacle or if time runs out.


## PHASE 2 — Sketch the Screens (10–20 minutes)
Draw 3 simple screens (paper or Excalidraw / FigJam / draw.io):


START SCREEN
----------------
[ Game Title ]
[ Start Button ]

GAME SCREEN
----------------
[ HUD (Heads up display) ]
   ├── [ Timer ]
   └── [ Score ]

[ Game Area ]
   ├── [ Forklift (player) ]
   ├── [ Box (cargo) ]
   ├── [ Obstacle (enemy) ]
   └── [ Drop Zone (target) ]

GAME OVER SCREEN
----------------
[ Result Text ]
[ Restart Button ]


Draw 3 simple screens (paper or Excalidraw / FigJam / draw.io):
Goal: identify DOM elements, not design beauty.



## PHASE 3 — DOM Inventory (CRITICAL STEP)


#app
 ├── #start-screen
 │     ├── h1#game-title
 │     └── button#start-btn
 │
 ├── #game-screen (hidden by default)
 │     ├── #hud
 │     │     ├── span#timer
 │     │     └── span#score
 │     │
 │     └── #game-area
 │           ├── #player
 │           ├── #box
 │           ├── .obstacle
 │           └── #drop-zone
 │
 └── #game-over-screen (hidden by default)
       ├── p#result-text
       └── button#restart-btn



## Followed workflow

### Governance
1. Defined rules and task files under .github/tasks

### Implementation
1. Player movement implementation

