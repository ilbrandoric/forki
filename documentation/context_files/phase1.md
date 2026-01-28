# CONTEXT RECORD — Phase 1: Foundation (Forki Rebuild)

## Purpose of Phase 1
Phase 1 established the absolute foundation of the Forki game rebuild.

The goal was **NOT** to build gameplay yet, but to:
- understand how a DOM-based game world is created
- separate logic from visuals
- build a coordinate system
- establish a render pipeline
- learn how JS controls the DOM
- debug real errors calmly
- create a safe learning workflow

Phase 1 is the **engine skeleton**.

---

## Branch Used
All work was done on:

- `learn`

Reference code lives on:
- `main`
- `archive/forklift-original`

---

# Phase 1 Timeline

---

## Step 1 — Intentional Empty Shell

### What was done
- Deleted all existing game code
- Created minimal files:
  - `index.html`
  - `style.css`
  - `main.js`
- Established a clean starting point

### Files

#### index.html
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app"></div>
  <script src="main.js"></script>
</body>
</html>
```

#### style.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

#### main.js
```js
console.log("Forki booting...");
```

---

# Phase 1 — Step 2: Game Container Creation

## Purpose of This Step
This step creates the **game world itself**.

Before this, there is no “game”, only an empty page.
After this step, there is a clearly defined **world space** that everything else will live inside.

This step teaches:
- how JavaScript creates structure
- how the DOM becomes a game world
- how coordinates will later make sense
- why JS owns layout in games (not HTML)

---

## Concept: JS Builds the World

In DOM-based games:
- HTML provides only a root
- JavaScript builds the entire world
- CSS styles the world
- Logic depends on JS-defined dimensions

This is why the game container is created in JS, not HTML.

---

## Step 2.2 — Create the Game Container (DOM)

In `main.js`:

```js
const app = document.getElementById("app");

const game = document.createElement("div");
game.id = "game";

game.style.width = GAME_WIDTH + "px";
game.style.height = GAME_HEIGHT + "px";
game.style.position = "relative";
game.style.background = "#222";
game.style.margin = "40px auto";

app.appendChild(game);
```

### What this does
- Creates a new DOM element
- Gives it an identity (`id="game"`)
- Sets its size using JS (single source of truth)
- Makes it a coordinate system (`position: relative`)
- Centers it on the page
- Attaches it to the DOM so it becomes visible

---

## Step 2.3 — Minimal Visual Styling (CSS)

In `style.css`:

```css
#game {
  border: 2px solid #555;
}
```

### Why this border matters
- Visually defines the world
- Helps debug collisions later
- Shows boundaries clearly

---

## Step 2.4 — Result (What You Should See)

After reloading the page, you should see:
- a centered rectangle
- 800px wide, 500px tall
- dark background
- visible border
- empty inside

This rectangle is the **game world**.

---

## Key Concept Learned: Coordinate Anchor

By setting:

```js
game.style.position = "relative";
```

You turned the game div into a coordinate system.

Every object inside it will later use:

```css
position: absolute;
left: x;
top: y;
```

Relative to **this container** — not the page.

---

## Mental Model

```
PAGE
 └── app
      └── game (world, relative)
           └── entities (absolute)
```

The game world now exists.
Everything else will live inside it.

---

## End of Step 2

At this point you have:
- a real game world
- a coordinate reference frame
- a DOM-based engine shell
- a safe place for entities

You are now ready to place things inside the world (Step 3).

**End of Phase 1, Step 2.**
