import { COLOR, UNIT_STATS } from "./constants.js";

class Shape {
  constructor(x, y, stats = {}) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;

    this.size = stats.size || 40;
    this.hp = stats.hp || 100;
    this.maxHp = stats.hp || 100;
    this.attack = stats.attack || 10;
    this.defense = stats.defense || 5;
    this.speed = stats.speed || 0.05;
    this.color = stats.color || "gray";
    this.price = stats.price || 100;
    this.mass = stats.mass || 1;

    this.radius = this.size / 1.2;
    this.isSelected = false;

    this.vx = 0;
    this.vy = 0;
    this.friction = 0.95;
  }

  applyImpulse(forceX, forceY) {
    this.x += forceX;
    this.y += forceY;
    this.targetX += forceX;
    this.targetY += forceY;
    this.vx += forceX;
    this.vy += forceY;
  }

  stop() {
    this.targetX = this.x;
    this.targetY = this.y;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.friction;
    this.vy *= this.friction;

    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance > 0.1) {
      let currentSpeed = this.speed * 500;

      if (distance < currentSpeed) {
        this.x = this.targetX;
        this.y = this.targetY;
      } else {
        this.x += (dx / distance) * currentSpeed;
        this.y += (dy / distance) * currentSpeed;
      }
    }
  }

  copy() {
    const offset = this.size;
    const angle = Math.random() * Math.PI * 2;
    const newX = this.x + Math.cos(angle) * offset;
    const newY = this.y + Math.sin(angle) * offset;

    return new this.constructor(newX, newY);
  }

  render(ctx, drawPath) {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.beginPath();
    drawPath(ctx, this.size);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    if (this.isSelected) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();

    const barWidth = this.size;
    const barHeight = 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.size + 10;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const hpRatio = Math.max(0, this.hp / this.maxHp);

    if (hpRatio > 0.6) {
      ctx.fillStyle = "#2ecc71";
    } else if (hpRatio > 0.3) {
      ctx.fillStyle = "#f1c40f";
    } else {
      ctx.fillStyle = "#e74c3c";
    }

    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  }
}

export class Rectangle extends Shape {
  constructor(x, y, stats = UNIT_STATS.RECTANGLE) {
    super(x, y, stats);
  }
  draw(ctx) {
    this.render(ctx, (ctx, size) => {
      ctx.rect(-size / 2, -size / 2, size, size);
    });
  }
}

export class Circle extends Shape {
  constructor(x, y, stats = UNIT_STATS.CIRCLE) {
    super(x, y, stats);
  }
  draw(ctx) {
    this.render(ctx, (ctx, size) => {
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    });
  }
}

export class Triangle extends Shape {
  constructor(x, y, stats = UNIT_STATS.TRIANGLE) {
    super(x, y, stats);
  }
  draw(ctx) {
    this.render(ctx, (ctx, size) => {
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
    });
  }
}

export class Pentagon extends Shape {
  constructor(x, y, stats = UNIT_STATS.PENTAGON) {
    super(x, y, stats);
  }
  draw(ctx) {
    this.render(ctx, (ctx, size) => {
      const radius = size / 2;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
    });
  }
}
