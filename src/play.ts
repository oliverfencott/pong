import { COLOR, HEIGHT, WIDTH } from './constants';
import { Actions, Mode } from './enums';
import { controls } from './input';
import { clamp, isColliding, vec2 } from './shared';

export default function (mode: Mode) {
  const PADDLE_HEIGHT = mode === Mode.FAST ? 80 : 64;
  const PADDLE_WIDTH = 16;

  let paused = false;

  const ball = {
    size: vec2(8, 8),
    position: vec2(WIDTH / 2, HEIGHT / 2),
    velocity: mode === Mode.FAST ? vec2(1, 1) : vec2(0.5, 0.5)
  };

  const paddleSize = Object.freeze(vec2(PADDLE_WIDTH, PADDLE_HEIGHT));

  const paddle1 = {
    size: paddleSize,
    position: vec2(0, HEIGHT / 2),
    score: 0
  };

  const paddle2 = {
    size: paddleSize,
    position: vec2(WIDTH - PADDLE_WIDTH, HEIGHT / 2),
    score: 0
  };

  const paddleAccelerationRate = mode === Mode.FAST ? 0.75 : 0.5;

  return { update, draw };

  function update(dt: number): Actions | void {
    if (controls.keyPressed.r) {
      return Actions.SET_TO_MENU;
    }

    if (controls.keyPressed.p) {
      paused = !paused;
    }

    if (paused) {
    } else {
      const ballAcceleration = dt * 0.5;

      // Ball
      ball.position.x = clamp(
        0,
        WIDTH,
        ball.position.x + ball.velocity.x * ballAcceleration
      );
      ball.position.y = clamp(
        0,
        HEIGHT,
        ball.position.y + ball.velocity.y * ballAcceleration
      );

      if (ball.position.x + ball.size.x >= WIDTH) {
        ball.velocity.x *= -1;
        paddle1.score += 1;
      }

      if (ball.position.x <= 0) {
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

    // Paddle1
    draw(ctx => {
      ctx.fillStyle = COLOR;
      ctx.fillRect(
        paddle1.position.x,
        paddle1.position.y,
        paddle1.size.x,
        paddle1.size.y
      );
    });

    // Paddle2
    draw(ctx => {
      ctx.fillStyle = COLOR;
      ctx.fillRect(
        paddle2.position.x,
        paddle2.position.y,
        paddle2.size.x,
        paddle2.size.y
      );
    });

    // Scores
    draw(ctx => {
      const QUARTER = WIDTH / 4;
      ctx.fillStyle = COLOR;
      ctx.fillText(paddle1.score.toLocaleString(), QUARTER, HEIGHT / 2);
      ctx.fillText(
        paddle2.score.toLocaleString(),
        QUARTER * 3 - QUARTER / 3,
        HEIGHT / 2
      );
    });

    // Ball
    draw(ctx => {
      ctx.fillStyle = COLOR;
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, ball.size.x, 0, 2 * Math.PI);
      ctx.fill();
    });

    if (paused) {
      ctx.globalAlpha = 0.4;
      draw(ctx => {
        //
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = COLOR;
        ctx.fillText('paused', 100, HEIGHT * 0.7);
        ctx.fillText('r = restart', 100, HEIGHT * 0.9);
        ctx.restore();
      });
    } else {
      ctx.globalAlpha = 1;
    }
  }
}
