import { Rectangle, Circle, Triangle, Pentagon } from "./units.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("contextmenu", (e) => e.preventDefault());

let shapes = [];
const classes = [Rectangle, Circle, Triangle, Pentagon];

for (let i = 0; i < 8; i++) {
  const RandomClass = classes[i % classes.length];
  shapes.push(
    new RandomClass(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
    ),
  );
}

let selection = {
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  isActive: false,
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((s) => s.update());

  for (let i = 0; i < 3; i++) {
    resolveCollisions();
  }

  shapes.forEach((s) => s.draw(ctx));

  if (selection.isActive) {
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
  requestAnimationFrame(animate);
}

function resolveCollisions() {
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let s1 = shapes[i];
      let s2 = shapes[j];

      let dx = s2.x - s1.x;
      let dy = s2.y - s1.y;
      let distance = Math.hypot(dx, dy);
      let minDistance = s1.radius + s2.radius;

      if (distance < minDistance) {
        let overlap = minDistance - distance;
        let nx = dx / distance;
        let ny = dy / distance;

        s1.x -= nx * (overlap / 2);
        s1.y -= ny * (overlap / 2);
        s2.x += nx * (overlap / 2);
        s2.y += ny * (overlap / 2);
      }
    }
  }
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
