export class Particle {
  constructor(x, y, color, speed, angle, friction = 0.95, gravity = 0.1) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.friction = friction;
    this.gravity = gravity;
    this.size = Math.random() * 3 + 1;
    this.color = color;
    this.alpha = 1;
    this.decay = Math.random() * 0.05 + 0.03;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}

export class Explosion {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.particles = [];
    this.shockwaveRadius = 0;
    this.shockwaveAlpha = 0.8;
    this.flashAlpha = 1;
    this.isFinished = false;

    for (let i = 0; i < 30; i++) {
      const pColor = Math.random() > 0.5 ? color : "#ff4500";
      this.particles.push(new Particle(x, y, pColor));
    }
  }

  update() {
    this.shockwaveRadius += 6;
    this.shockwaveAlpha -= 0.03;

    this.flashAlpha -= 0.1;

    this.particles.forEach((p) => p.update());
    this.particles = this.particles.filter((p) => p.alpha > 0);

    if (this.particles.length === 0 && this.shockwaveAlpha <= 0) {
      this.isFinished = true;
    }
  }

  draw(ctx) {
    ctx.save();

    if (this.shockwaveAlpha > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.shockwaveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.shockwaveAlpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (this.flashAlpha > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 150, ${this.flashAlpha})`;
      ctx.fill();
    }

    this.particles.forEach((p) => p.draw(ctx));

    ctx.restore();
  }
}
