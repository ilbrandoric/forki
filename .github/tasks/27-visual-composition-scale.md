# 27 – Visual Composition & Scale Adjustment (Visual Only)

## Purpose

Fix visual composition issues after polish:
- Center Start / Game Over modals relative to playfield
- Increase horizontal playfield size for better pacing
- Reduce entity icon size for smoother movement feel
- Improve spatial balance without touching gameplay logic

This task is visual only.

---

## Scope (Strict)

This task may modify:
- style.css
- index.html

This task must NOT:
- Modify any JavaScript
- Change gameplay behavior
- Change collision math
- Change movement timing
- Change entity positioning logic
- Change IDs used by JS

---

## Visual Changes Allowed

### 1. Playfield size
- Increase width from 600px → 800px
- Keep height at 400px
- Update CSS only
- JS collision math already uses DOM bounds (safe)

### 2. Entity visual scale
- Reduce emoji font-size:
  - Player, Box: ~28–30px
  - Rat: ~26–28px
  - Persons: ~22px
  - Cones: ~22px
- No box-model changes
- No padding, margin, border

### 3. Modal centering (Start / Game Over)
- Modals must center relative to playfield
- Use playfield container as positioning reference
- Modal should feel “attached” to the game

### 4. HUD alignment
- Keep HUD width equal to playfield width
- HUD remains attached to top of playfield

---

## Required Constraints (Critical)

- No transforms on entities
- No padding/border on entities
- No JS changes
- No new selectors for JS
- No changes to collision logic
- No CSS that changes entity offset math
- Drop zone stays at right: 20px, bottom: 20px
- Playfield remains pixel-perfect rectangle

---

## Validation Rules

- Player movement feels smoother
- More horizontal space for navigation
- No accidental overlaps increased
- Modals visually centered over playfield
- Entities clearly visible but not oversized
- No behavior changes
- No console errors

User must confirm visuals only changed.
