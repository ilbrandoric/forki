console.log("collision.js loaded")

// ============================================================================
// UTILITY: Collision Detection (AABB - Axis-Aligned Bounding Box)
// Used by: goal.js, obstacles.js, player.js (box collision)
// ============================================================================
//
// COLLISION PARTICIPATION REGISTRY:
// This is the central authority for understanding which entities collide with what.
//
// Movement-Blocking Collisions (checked before movement is applied):
//   1. Player vs Cones        – checked in main.js via canMove()
//   2. Box vs Cones           – checked in main.js via canMove()
//   3. Persons vs Cones       – checked in obstacles.js before person movement
//   4. Persons vs Boundaries  – checked in obstacles.js (bounce on edges)
//
// Terminal Collisions (checked after movement):
//   5. Player vs Box          – checked in player.js (push logic, not a goal)
//   6. Player vs Goal Zone    – checked by goal.js (owns this check) when box reaches it
//   7. Box vs Goal Zone       – checked by goal.js (owns this check) for win condition
//   8. Player vs Persons      – checked in obstacles.js (person is aggressive)
//   9. Box vs Persons         – checked in obstacles.js (person is aggressive)
//
// Collision Ownership Rules:
//   - Blocking collisions: checked at movement decision point (main.js canMove)
//   - Terminal collisions: checked by the entity that "triggers" the outcome
//     * Goal owns its win check (goal.js)
//     * Persons own their hazard checks (obstacles.js)
//     * Player owns its box-push check (player.js)
//
// Symmetry:
//   - Some collisions are checked by one side: Persons check Player/Box (not vice versa)
//   - This is intentional: Persons are autonomous hazards, Player/Box are passive
//
// ============================================================================

// Collision detection function using AABB algorithm
export function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect()
  const rect2 = element2.getBoundingClientRect()
  
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  )
}
