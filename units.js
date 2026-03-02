import { PHYSICS, UNIT_STATS, UNIT_PROPERTIES } from "./constants.js";

class Shape {
  constructor(x, y, stats = {}) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;

    this.size = stats.size;
    this.hp = stats.hp;
    this.maxHp = stats.hp;
    this.attack = stats.attack;
    this.defense = stats.defense;
    this.speed = stats.speed;
    this.color = stats.color;
    this.price = stats.price;
    this.mass = stats.mass;
    this.rotation = 0;

    this.radius = this.size / 2;
    this.isSelected = false;

    this.vx = 0;
    this.vy = 0;
    this.friction = PHYSICS.friction;
  }

  applyImpulse(fx, fy) {
    this.vx += fx;
    this.vy += fy;

    this.targetX = this.x + fx * PHYSICS.impulseToTarget;
    this.targetY = this.y + fy * PHYSICS.impulseToTarget;
  }

  stop() {
    this.targetX = this.x;
    this.targetY = this.y;
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -1;
      this.targetX = this.x + Math.abs(this.vx) * PHYSICS.predictionFactor;
    } else if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.vx *= -1;
      this.targetX = this.x - Math.abs(this.vx) * PHYSICS.predictionFactor;
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -1;
      this.targetY = this.y + Math.abs(this.vy) * PHYSICS.predictionFactor;
    } else if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius;
      this.vy *= -1;
      this.targetY = this.y - Math.abs(this.vy) * PHYSICS.predictionFactor;
    }

    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance > 1) {
      let currentSpeed = this.speed * PHYSICS.speedMultiplier;
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
    ctx.rotate(this.rotation);

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

    if (hpRatio > UNIT_PROPERTIES.hpYellow) {
      ctx.fillStyle = "#2ecc71";
    } else if (hpRatio > UNIT_PROPERTIES.hpRed) {
      ctx.fillStyle = "#f1c40f";
    } else {
      ctx.fillStyle = "#e74c3c";
    }

    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  }

  drawPolygon(ctx, sides) {
    this.render(ctx, (ctx, size) => {
      const radius = size / 2;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    });
  }
}

export class Polygon extends Shape {
  constructor(x, y, stats) {
    super(x, y, stats);
    // Jeśli sides nie jest zdefiniowane w stats, domyślnie ustawiamy 0 dla koła
    this.sides = stats?.sides || 0;
  }

  draw(ctx) {
    if (this.sides > 2) {
      this.drawPolygon(ctx, this.sides);
    } else {
      this.render(ctx, (ctx, size) => {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }
  }
}
