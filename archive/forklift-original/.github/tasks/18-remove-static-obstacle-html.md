# Task — Iteration 18: Remove Static Obstacle From HTML

## Problem

A static person appears at (0,0) because an old obstacle/person element still exists in index.html.

This violates architecture:
- obstacles/persons must be created dynamically
- no world objects may exist in HTML

---

## Objective

Remove any static obstacle/person elements from HTML so that:
- only JS-created persons exist
- no element defaults to (0,0)

---

## Files Allowed

- index.html

---

## Rules

- Remove ONLY static obstacle/person markup
- Do NOT add new HTML
- Do NOT change structure
- Do NOT add logic
- JS remains unchanged

---

## Definition of Done

- No person at (0,0)
- All persons are spawned by JS only
- Game works as before
