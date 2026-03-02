import { Explosion } from "./explosion.js";

export function resolveCollisions(shapes) {
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let s1 = shapes[i];
      let s2 = shapes[j];

      let dx = s2.x - s1.x;
      let dy = s2.y - s1.y;
      let distance = Math.hypot(dx, dy);
      let minDistance = s1.radius + s2.radius;

      if (distance < minDistance && distance > 0) {
        const damageToS2 = Math.max(0.1, s1.attack * 0.05 - s2.defense * 0.02);

        const damageToS1 = Math.max(0.1, s2.attack * 0.05 - s1.defense * 0.02);

        s1.hp -= damageToS1;
        s2.hp -= damageToS2;

        let overlap = minDistance - distance;
        let nx = dx / distance;
        let ny = dy / distance;

        let totalMass = s1.mass + s2.mass;
        let ratio1 = s2.mass / totalMass;
        let ratio2 = s1.mass / totalMass;

        s1.x -= nx * overlap * ratio1;
        s1.y -= ny * overlap * ratio1;
        s2.x += nx * overlap * ratio2;
        s2.y += ny * overlap * ratio2;

        const s1IsStanding =
          Math.hypot(s1.targetX - s1.x, s1.targetY - s1.y) < 2;
        const s2IsStanding =
          Math.hypot(s2.targetX - s2.x, s2.targetY - s2.y) < 2;

        if (s1IsStanding) {
          s1.targetX = s1.x;
          s1.targetY = s1.y;
        }
        if (s2IsStanding) {
          s2.targetX = s2.x;
          s2.targetY = s2.y;
        }
      }
    }
  }
}

export function handleDeath(deadUnits, allUnits, effects) {
  deadUnits.forEach((unit) => {
    effects.push(new Explosion(unit.x, unit.y, unit.color));

    const blastRadius = 150;
    const blastForce = 15;

    allUnits.forEach((other) => {
      if (other.hp > 0 && other !== unit) {
        const dx = other.x - unit.x;
        const dy = other.y - unit.y;
        const dist = Math.hypot(dx, dy);

        if (dist < blastRadius) {
          const power = (blastRadius - dist) / blastRadius;
          const fx = (dx / dist) * blastForce * power;
          const fy = (dy / dist) * blastForce * power;

          other.applyImpulse(fx, fy);

          other.hp -= 5 * power;
        }
      }
    });
  });
}

export function drawSelection(ctx, selection) {
  if (!selection.isActive) return;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1;
  ctx.strokeRect(
    selection.startX,
    selection.startY,
    selection.currentX - selection.startX,
    selection.currentY - selection.startY,
  );
  ctx.setLineDash([]);
}
