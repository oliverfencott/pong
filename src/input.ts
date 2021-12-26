import { vec2 } from './shared';

type keys = {
  p: boolean;
  up: boolean;
  down: boolean;
  w: boolean;
  s: boolean;
  r: boolean;
  f: boolean;
};

export const controls: {
  mouseDown: boolean;
  mouse: vec2;
  keyDown: keys;
  keyPressed: keys;
} = {
  mouseDown: false,
  mouse: vec2(0, 0),
  keyDown: {
    p: false,
    up: false,
    down: false,
    w: false,
    s: false,
    r: false,
    f: false
  },
  keyPressed: {
    p: false,
    up: false,
    down: false,
    w: false,
    s: false,
    r: false,
    f: false
  }
};

export function init(ctx: CanvasRenderingContext2D) {
  const dims = ctx.canvas.getBoundingClientRect();
  const keys: [keyof keys, string][] = [
    ['p', 'KeyP'],
    ['up', 'ArrowUp'],
    ['down', 'ArrowDown'],
    ['w', 'KeyW'],
    ['s', 'KeyS'],
    ['r', 'KeyR'],
    ['f', 'KeyF']
  ];

  window.addEventListener('mousemove', event => {
    controls.mouse.x = event.clientX - dims.left;
    controls.mouse.y = event.clientY - dims.top;
  });

  window.addEventListener('mousedown', _event => {
    controls.mouseDown = true;
  });

  window.addEventListener('mouseup', _event => {
    controls.mouseDown = false;
  });

  window.addEventListener('keypress', event => {
    for (const [key, keyCode] of keys) {
      if (event.code === keyCode) {
        controls.keyPressed[key] = true;

        window.setTimeout(() => {
          controls.keyPressed[key] = false;
        }, 17);
      }
    }
  });

  window.addEventListener('keydown', event => {
    for (const [key, keyCode] of keys) {
      if (event.code === keyCode) {
        controls.keyDown[key] = true;
      }
    }
  });

  window.addEventListener('keyup', event => {
    for (const [key, keyCode] of keys) {
      if (event.code === keyCode) {
        controls.keyDown[key] = false;
      }
    }
  });
}
