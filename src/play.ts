import {
  BALL_COLOR,
  HEIGHT,
  PADDLE_COLOR,
  SCORE_COLOR,
  TEXT_COLOR,
  WIDTH
} from './constants';
import { Actions, Mode } from './enums';
import { controls } from './input';
import { makeParticle, particle } from './partcile';
import { clamp, isColliding, sign, vec2 } from './shared';

type paddle = {
  size: Readonly<vec2>;
  position: vec2;
  score: number;
};

export default function (mode: Mode) {
  const paddleHeight = mode === Mode.FAST ? 80 : 64;
  const PADDLE_WIDTH = 16;

  let paused = false;
  let timeElapsed = 0;

  const ball = {
    size: vec2(8, 8),
    position: vec2(WIDTH / 2, HEIGHT / 2),
    velocity: mode === Mode.FAST ? vec2(8.5, 8.5) : vec2(5, 5),
    maxVelocity: mode === Mode.FAST ? vec2(15, 15) : vec2(7.5, 7.5)
  };

  const paddleSize = Object.freeze(vec2(PADDLE_WIDTH, paddleHeight));

  const paddle1: paddle = {
    size: paddleSize,
    position: vec2(0, HEIGHT / 3),
    score: 0
  };

  const paddle2: paddle = {
    size: paddleSize,
    position: vec2(WIDTH - PADDLE_WIDTH, HEIGHT / 1.5),
    score: 0
  };

  const paddleAccelerationRate = mode === Mode.FAST ? 0.75 : 0.5;

  const particles: particle[] = [];

  return { update, draw };

  function update(dt: number): Actions | void {
    if (controls.keyPressed.r) {
      return Actions.SET_TO_MENU;
    }

    if (controls.keyPressed.p) {
      paused = !paused;
    }

    if (paused) {
      //
    } else {
      timeElapsed += dt / 1000;

      const ballAcceleration = dt / 10000;

      {
        const xDir = sign(ball.velocity.x);
        const currentX = Math.abs(ball.velocity.x);

        if (currentX !== ball.maxVelocity.x) {
          ball.velocity.x =
            Math.min(ball.maxVelocity.x, currentX + ballAcceleration) * xDir;
        }
      }

      {
        const yDir = sign(ball.velocity.y);
        const currentY = Math.abs(ball.velocity.y);

        if (currentY !== ball.maxVelocity.y) {
          ball.velocity.y =
            Math.min(ball.maxVelocity.y, currentY + ballAcceleration) * yDir;
        }
      }

      ball.position.x = clamp(0, WIDTH, ball.position.x + ball.velocity.x);
      ball.position.y = clamp(0, HEIGHT, ball.position.y + ball.velocity.y);

      let particlesCount = 30;

      if (ball.position.x + ball.size.x >= WIDTH) {
        while (--particlesCount) {
          particles.push(
            makeParticle(ball.position, -1, sign(Math.random() - 0.5))
          );
        }

        ball.velocity.x *= -1;
        paddle1.score += 1;
      }

      if (ball.position.x <= 0) {
        while (--particlesCount) {
          particles.push(makeParticle(ball.position, 1, sign(Math.random())));
        }
        ball.velocity.x *= -1;
        paddle2.score += 1;
      }

      if (ball.position.y <= 0) {
        ball.velocity.y *= -1;
      }

      if (ball.position.y + ball.size.y >= HEIGHT) {
        ball.velocity.y *= -1;
      }

      const paddleAcceleration = dt * paddleAccelerationRate;

      // Paddle 1
      if (controls.keyDown.w) {
        paddle1.position.y = clamp(
          0,
          HEIGHT - paddle1.size.y,
          paddle1.position.y - paddleAcceleration
        );
      }
      if (controls.keyDown.s) {
        paddle1.position.y = clamp(
          0,
          HEIGHT - paddle1.size.y,
          paddle1.position.y + paddleAcceleration
        );
      }

      if (
        ball.velocity.x < 0 &&
        isColliding(
          ball.position.x,
          ball.position.y,
          ball.size.x,
          ball.size.y,
          paddle1.position.x,
          paddle1.position.y,
          paddle1.size.x,
          paddle1.size.y
        )
      ) {
        ball.velocity.x *= -1;
      }

      // Paddle 2
      if (controls.keyDown.up) {
        paddle2.position.y = clamp(
          0,
          HEIGHT - paddle2.size.y,
          paddle2.position.y - paddleAcceleration
        );
      }
      if (controls.keyDown.down) {
        paddle2.position.y = clamp(
          0,
          HEIGHT - paddle2.size.y,
          paddle2.position.y + paddleAcceleration
        );
      }

      if (
        ball.velocity.x > 0 &&
        isColliding(
          ball.position.x,
          ball.position.y,
          ball.size.x,
          ball.size.y,
          paddle2.position.x,
          paddle2.position.y,
          paddle2.size.x,
          paddle2.size.y
        )
      ) {
        ball.velocity.x *= -1;
      }
    }

    particles.forEach((p, index) => {
      p.position.x += p.dir.x * p.acc.x;
      p.position.y += p.dir.y * p.acc.y;
      p.opacity -= dt / 2000;

      if (p.opacity < 0) {
        particles.splice(index, 1);
      }
    });
  }

  function withRestore(ctx: CanvasRenderingContext2D) {
    return (fn: (ctx: CanvasRenderingContext2D) => void) => {
      ctx.save();
      fn(ctx);
      ctx.restore();
    };
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const draw = withRestore(ctx);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Clock
    draw(ctx => {
      ctx.font = '20px monospace';
      ctx.fillStyle = TEXT_COLOR;
      const secondsElapsed = Math.floor(timeElapsed);

      ctx.fillText(secondsElapsed.toString(), 8, 24);
    });

    // Scores
    draw(ctx => {
      const QUARTER = WIDTH / 4;

      ctx.fillStyle = SCORE_COLOR;
      ctx.fillText(paddle1.score.toLocaleString(), QUARTER, HEIGHT / 2);
      ctx.fillText(
        paddle2.score.toLocaleString(),
        QUARTER * 3 - QUARTER / 3,
        HEIGHT / 2
      );
    });

    // Ball
    draw(ctx => {
      ctx.fillStyle = BALL_COLOR;
      ctx.beginPath();
      ctx.arc(
        ball.position.x + ball.size.x / 2,
        ball.position.y + ball.size.y / 2,
        ball.size.x,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });

    // Paddle1
    draw(ctx => {
      ctx.fillStyle = PADDLE_COLOR;
      ctx.fillRect(
        paddle1.position.x,
        paddle1.position.y,
        paddle1.size.x,
        paddle1.size.y
      );
    });

    // Paddle2
    draw(ctx => {
      ctx.fillStyle = PADDLE_COLOR;
      ctx.fillRect(
        paddle2.position.x,
        paddle2.position.y,
        paddle2.size.x,
        paddle2.size.y
      );
    });

    // Particles
    for (const p of particles) {
      draw(ctx => {
        const color = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;

        ctx.fillStyle = color;
        ctx.fillRect(p.position.x, p.position.y, p.size.x, p.size.y);
      });
    }

    if (paused) {
      ctx.globalAlpha = 0.4;
      draw(ctx => {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText('paused', 100, HEIGHT * 0.7);
        ctx.fillText('r = restart', 100, HEIGHT * 0.9);
        ctx.restore();
      });
    } else {
      ctx.globalAlpha = 1;
    }
  }
}
