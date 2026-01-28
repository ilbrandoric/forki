# 26 – Visual Polish Phase (Non-Behavioral)

## Purpose

Improve the visual presentation of the game without changing gameplay, timing,
collision, or behavior.

This task is cosmetic only.

---

## Scope (Strict)

This task may modify:
- CSS (style.css)
- HTML structure (index.html)
- Visual DOM attributes (classes, wrappers, layout)
- Fonts, spacing, colors, borders
- Simple visual effects (hover, transitions)

This task must NOT:
- Change any JavaScript logic
- Change timing or movement
- Change collision rules
- Change gameplay behavior
- Introduce new systems
- Add animations that affect gameplay
- Modify JS files

If behavior changes, the task fails.

---

## Visual Goals

### 1. Playfield clarity
- Center the game area on screen
- Add clear border/frame around playfield
- Make playfield visually distinct from background

### 2. UI clarity
- Make score and timer visually grouped
- Improve readability (font size, spacing)
- Keep UI stable (no movement when values change)

### 3. Entity clarity
- Improve contrast between:
  - Player
  - Box
  - Cones
  - Persons
  - Rat
  - Goal
- No ambiguity in visuals
- Emoji may be replaced with styled divs if desired

### 4. Feedback polish (visual only)
- Hover effects on buttons
- Subtle transitions (opacity, color)
- Clear start / game over screens

---

## Files in Scope

- `style.css`
- `index.html`

Only these files may be modified.

---

## Required Constraints

- All entity positions must remain pixel-identical
- DOM structure changes must not affect JS selectors
- No new IDs that JS depends on
- No CSS that alters box model in a way that shifts gameplay
- No animations that move entities
- No CSS transforms on entities (translate/scale/rotate)

---

## Validation Rules

This task is done only when:

### Visuals
- Playfield is centered
- Playfield has a clear border
- UI is readable and stable
- Entities are visually distinct
- Start / Game Over screens look intentional
- No layout shift during gameplay

### Behavior
- Player movement identical
- Box push identical
- Collisions identical
- Rat movement identical
- Person movement identical
- Timer and score unchanged
- No console errors

User must confirm visuals only changed.

---

## Output Expectation

After this task:
- Game looks intentional, not raw
- Architecture untouched
- Behavior untouched
- Future art replacement is easy
- Game is presentation-ready

Copilot must stop and wait for user validation when finished.
