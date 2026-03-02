const COLOR = "rgba(0,100,255,1)";

const UNIT_STATS = {
  RECTANGLE: {
    color: COLOR,
    speed: 0.004,
    hp: 200,
    attack: 15,
    defense: 20,
    size: 45,
    price: 150,
  },
  CIRCLE: {
    color: COLOR,
    speed: 0.008,
    hp: 100,
    attack: 10,
    defense: 5,
    size: 40,
    price: 100,
  },
  TRIANGLE: {
    color: COLOR,
    speed: 0.012,
    hp: 60,
    attack: 25,
    defense: 2,
    size: 35,
    price: 120,
  },
  PENTAGON: {
    color: COLOR,
    speed: 0.01,
    hp: 120,
    attack: 18,
    defense: 10,
    size: 42,
    price: 130,
  },
};

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

    this.radius = this.size / 1.2;
    this.isSelected = false;
  }

  stop() {
    this.targetX = this.x;
    this.targetY = this.y;
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      this.x += (dx / distance) * (this.speed * 100);
      this.y += (dy / distance) * (this.speed * 100);
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }
  copy() {
    const offset = this.size;
    const angle = Math.random() * Math.PI * 2;
    const newX = this.x + Math.cos(angle) * offset;
    const newY = this.y + Math.sin(angle) * offset;

    return new this.constructor(newX, newY, {
      size: this.size,
      hp: this.maxHp, // Nowy zaczyna z pełnym HP
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      color: this.color,
      price: this.price,
    });
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
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    ctx.restore();
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
