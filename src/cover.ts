import { HEIGHT, TEXT_COLOR, WIDTH } from './constants';
import { Actions } from './enums';
import { makeParticle, particle } from './partcile';
import { clamp, vec2 } from './shared';

export function cover() {
  const particles: particle[] = [];
  const ITERATIONS = 500;
  let i = ITERATIONS;

  while (--i) {
    const xInc = WIDTH / ITERATIONS;
    const yInc = HEIGHT / ITERATIONS;
    const p = makeParticle(
      vec2(
        clamp(xInc * i, xInc * (i + 1), Math.random() * xInc),
        clamp(yInc * i, yInc * (i + 1), Math.random() * yInc)
      ),
      0,
      0
    );
    p.opacity = 0.75;

    p.position.x += (Math.random() - 0.5) * 100;
    p.position.y += (Math.random() - 0.5) * 100;
    p.opacity -= Math.random();
    particles.push(p);
  }

  return {
    update(_dt: number): Actions | void {
      //
    },

    draw(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      for (const p of particles) {
        ctx.save();
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;
        ctx.fillRect(p.position.x, p.position.y, p.size.x, p.size.y);
        ctx.restore();
      }

      ctx.fillStyle = TEXT_COLOR;
      ctx.fillText('cong', 260, 250);
    }
  };
}
