import { Polygon } from "./units.js";
import { UNIT_STATS } from "./constants.js";
import {
  resolveCollisions,
  handleDeath,
  drawSelection,
  createCollisionSparks,
} from "./helpers.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("contextmenu", (e) => e.preventDefault());

let shapes = [];
let effects = [];

const unitTypes = [
  UNIT_STATS.TRIANGLE,
  UNIT_STATS.RECTANGLE,
  UNIT_STATS.PENTAGON,
  UNIT_STATS.CIRCLE,
];

const startX = 100;
const startY = 100;
const spacing = 80;

unitTypes.forEach((stats, i) => {
  shapes.push(new Polygon(startX, startY + i * spacing, stats));
});

let selection = {
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  isActive: false,
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dead = shapes.filter((s) => s.hp <= 0);

  if (dead.length > 0) {
    handleDeath(dead, shapes, effects);
    shapes = shapes.filter((s) => s.hp > 0);
  }

  shapes.forEach((s) => s.update());

  for (let i = 0; i < 3; i++) {
    resolveCollisions(shapes, effects, createCollisionSparks);
  }

  shapes.forEach((s) => s.draw(ctx));

  effects.forEach((e) => e.update());
  effects = effects.filter((e) => !e.isFinished);
  effects.forEach((e) => e.draw(ctx));

  drawSelection(ctx, selection);

  requestAnimationFrame(animate);
}
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    selection.isActive = true;
    selection.startX = e.clientX;
    selection.startY = e.clientY;
    selection.currentX = e.clientX;
    selection.currentY = e.clientY;

    shapes.forEach((s) => (s.isSelected = false));
    for (let i = shapes.length - 1; i >= 0; i--) {
      let s = shapes[i];
      let dist = Math.hypot(e.clientX - s.x, e.clientY - s.y);

      if (dist < s.radius) {
        s.isSelected = true;
        selection.isActive = false;
        break;
      }
    }
  } else if (e.button === 2) {
    let clickedShape = null;
    for (let i = shapes.length - 1; i >= 0; i--) {
      let s = shapes[i];
      if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < s.radius) {
        clickedShape = s;
        break;
      }
    }

    if (clickedShape && clickedShape.isSelected) {
      const newShape = clickedShape.copy();
      newShape.isSelected = false;
      shapes.push(newShape);
    } else {
      shapes
        .filter((s) => s.isSelected)
        .forEach((s) => {
          const spread = 50;
          s.targetX = e.clientX + (Math.random() * spread - spread / 2);
          s.targetY = e.clientY + (Math.random() * spread - spread / 2);
        });
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (selection.isActive) {
    selection.currentX = e.clientX;
    selection.currentY = e.clientY;

    const left = Math.min(selection.startX, selection.currentX);
    const right = Math.max(selection.startX, selection.currentX);
    const top = Math.min(selection.startY, selection.currentY);
    const bottom = Math.max(selection.startY, selection.currentY);

    shapes.forEach((s) => {
      s.isSelected = s.x > left && s.x < right && s.y > top && s.y < bottom;
    });
  }
});

window.addEventListener(
  "wheel",
  (e) => {
    let adjusted = false;
    shapes.forEach((shape) => {
      if (shape.isSelected) {
        const rotateSpeed = 0.15;

        if (e.deltaY < 0) {
          shape.rotation -= rotateSpeed;
        } else {
          shape.rotation += rotateSpeed;
        }
        adjusted = true;
      }
    });

    if (adjusted) {
      e.preventDefault();
    }
  },
  { passive: false },
);

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "s") {
    shapes.filter((s) => s.isSelected).forEach((s) => s.stop());
  }
});

window.addEventListener("mouseup", () => (selection.isActive = false));
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
animate();
