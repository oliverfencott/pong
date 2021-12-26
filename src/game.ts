import { controls, init } from './input';

function clamp(min: number, max: number, x: number) {
  return Math.max(min, Math.min(max, x));
}

type vec2 = {
  x: number;
  y: number;
};

const vec2 = (x: number, y: number): vec2 => ({ x, y });

const color = 'rgb(200, 200, 200)';
const WIDTH = 720;
const HEIGHT = 480;
const PADDLE_HEIGHT = 64;
const PADDLE_WIDTH = 16;

const ball = {
  size: vec2(8, 8),
  position: vec2(WIDTH / 2, HEIGHT / 2),
  velocity: vec2(0.5, 0.5)
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

export function load(ctx: CanvasRenderingContext2D) {
  ctx.canvas.height = HEIGHT;
  ctx.canvas.width = WIDTH;
  ctx.canvas.style.borderWidth = '1px';
  ctx.canvas.style.borderColor = color;
  ctx.canvas.style.borderStyle = 'solid';

  ctx.font = '80px monospace';

  init();
}

export function update(dt: number) {
  const acceleration = dt / 2;

  // Ball
  ball.position.x += ball.velocity.x * acceleration;
  ball.position.y += ball.velocity.y * acceleration;

  if (ball.position.x + ball.size.x > WIDTH) {
    ball.velocity.x *= -1;
    paddle1.score += 1;
  }

  if (ball.position.x < 0) {
    ball.velocity.x *= -1;
    paddle2.score += 1;
  }

  if (ball.position.y < 0) {
    ball.velocity.y *= -1;
  }

  if (ball.position.y + ball.size.y > HEIGHT) {
    ball.velocity.y *= -1;
  }

  // Paddle 1
  if (controls.w) {
    paddle1.position.y = clamp(
      0,
      HEIGHT - PADDLE_HEIGHT,
      paddle1.position.y - acceleration
    );
  }
  if (controls.s) {
    paddle1.position.y = clamp(
      0,
      HEIGHT - PADDLE_HEIGHT,
      paddle1.position.y + acceleration
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
  if (controls.up) {
    paddle2.position.y = clamp(
      0,
      HEIGHT - PADDLE_HEIGHT,
      paddle2.position.y - acceleration
    );
  }
  if (controls.down) {
    paddle2.position.y = clamp(
      0,
      HEIGHT - PADDLE_HEIGHT,
      paddle2.position.y + acceleration
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

const withRestore =
  (ctx: CanvasRenderingContext2D) =>
  (fn: (ctx: CanvasRenderingContext2D) => void) => {
    ctx.save();
    fn(ctx);
    ctx.restore();
  };

export function draw(ctx: CanvasRenderingContext2D) {
  const draw = withRestore(ctx);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Paddle1
  draw(ctx => {
    ctx.fillStyle = color;
    ctx.fillRect(
      paddle1.position.x,
      paddle1.position.y,
      paddle1.size.x,
      paddle1.size.y
    );
  });

  // Paddle2
  draw(ctx => {
    ctx.fillStyle = color;
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
    ctx.fillStyle = color;
    ctx.fillText(paddle1.score.toLocaleString(), QUARTER, HEIGHT / 2);
    ctx.fillText(
      paddle2.score.toLocaleString(),
      QUARTER * 3 - QUARTER / 3,
      HEIGHT / 2
    );
  });

  // Ball
  draw(ctx => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.size.x, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function isColliding(
  a_x: number,
  a_y: number,
  a_w: number,
  a_h: number,
  b_x: number,
  b_y: number,
  b_w: number,
  b_h: number
) {
  return !(
    b_x > a_w + a_x ||
    a_x > b_w + b_x ||
    b_y > a_h + a_y ||
    a_y > b_h + b_y
  );
}
