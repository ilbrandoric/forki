# Forki — Bird’s-Eye View

## 1. Project Overview (What this is)
This is a small browser game built in plain JavaScript with no frameworks. The DOM is the game world, and everything is intentionally simple and explicit so it is easy to read and learn from.

*For fast immersion, do checkout the [audio-guide](documentation/reference-material/audio-guide.m4a) and [how it comes to life](documentation/how-it-comes-to-life.md) sources. 

## 2. How to Run the Project
- Open [https://ilbrandoric.github.io/forki/](https://ilbrandoric.github.io/forki/)
- Or clone and open [index.html](index.html) in a browser.
- No build step, no install, no dependencies.

## 3. Repository Structure (High Level)
A quick guided tour of the top level:
- [index.html](index.html) — entry point that defines the world.
- [style.css](style.css) — visuals only.
- [js/](js/) — all game logic.
- [documentation/](documentation/) — human‑readable explanations.
- [.github/tasks/](.github/tasks/) — Copilot instruction history (process, not runtime).
- [archive/](archive/) — historical reference (v1).
- [reference/](reference/) — inspiration material.
- [assets/](assets/) — audio or images.

## 4. Runtime Architecture (Very High Level)
At a high level:
- The DOM is the world.
- Entities are DOM elements.
- Movement is pixel‑based.
- Collisions use DOM rectangles.
- State controls when systems run.
- Timing is split into:
  - Event‑driven updates (player).
  - Interval‑driven updates (obstacles, timer).

  ![DOm Game Anatomy](documentation/reference-material/dom-game-anatomy.png)


## 5. Navigation Guide (Where to read next)
For deeper explanations, start here:
- [documentation/architecture-overview.md](documentation/architecture-overview.md)
- [documentation/boot-flow.md](documentation/boot-flow.md)
- [documentation/state-machine.md](documentation/state-machine.md)
- [documentation/entity-model.md](documentation/entity-model.md)
- [documentation/collision-model.md](documentation/collision-model.md)
- [documentation/timing-model.md](documentation/timing-model.md)
- [documentation/reset-logic.md](documentation/reset-logic.md)
- [documentation/responsibility-map.md](documentation/responsibility-map.md)
- [documentation/data-flow.md](documentation/data-flow.md)

## 6. Additional resources
Check out the reference materials for deep comprehension. 

- [reference material](documentation/reference-material/)
- [game architecture](documentation/reference-material/game-architecture.pdf)


