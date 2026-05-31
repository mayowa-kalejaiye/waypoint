/**
 * Trigger confetti animation
 */
export const triggerConfetti = () => {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const confetti = [];
  const confettiCount = 100;
  const gravity = 0.5;

  class Confetti {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height;
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = Math.random() * 3 + 2;
      this.size = Math.random() * 8 + 4;
      this.rotation = Math.random() * Math.PI;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.01;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }

    isAlive() {
      return this.opacity > 0 && this.y < height;
    }
  }

  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetti());
  }

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.update();
      c.draw(ctx);

      if (!c.isAlive()) {
        confetti.splice(i, 1);
      }
    }

    if (confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  };

  animate();
};
