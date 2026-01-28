# Task — Iteration 15: Fix Blocking Decision Point

## Status
OPEN

---

## Problem

Cone blocking logic exists, but it is NOT stopping movement.

This means:
- The blocking decision is not being applied at the correct point
- Or it is applied after movement already happened
- Or its return value is ignored

---

## Objective

Ensure cone blocking is checked at the **single authoritative decision point**
before ANY of the following occur:

- Player movement
- Box movement
- Box pushing

If blocked → movement MUST be cancelled atomically.

---

## Architectural Rules (NON-NEGOTIABLE)

- Player.js must NOT be modified
- Box.js must NOT be modified
- Cone geometry remains private to obstacles.js
- Only a single boolean blocking decision may be used
- main.js must be the gatekeeper of movement
- Entities remain dumb
- No refactors
- No new systems

---

## Required Fix (Conceptual)

1. Identify the EXACT place in main.js where movement is approved
2. Insert blocking check BEFORE movement is applied
3. If blocked → return early, do nothing
4. Ensure:
   - Player movement uses blocking check
   - Box pushing uses blocking check
   - No movement occurs if blocked

---

## Definition of Done

- Forklift cannot enter cone space
- Box cannot enter cone space
- Box cannot be pushed into cone space
- Blocking is atomic
- No regressions

---

## Copilot Instructions

Copilot MUST:
1. Read this file
2. Produce an implementation plan
3. STOP and wait for approval
4. Only after approval, write code
