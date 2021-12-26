import { COLOR, HEIGHT, WIDTH } from './constants';
import { Actions, Mode } from './enums';
import { init } from './input';
import menu from './menu';
import play from './play';

const scene = {
  current: menu()
};

export function load(ctx: CanvasRenderingContext2D) {
  ctx.canvas.height = HEIGHT;
  ctx.canvas.width = WIDTH;
  ctx.canvas.style.borderWidth = '1px';
  ctx.canvas.style.borderColor = COLOR;
  ctx.canvas.style.borderStyle = 'solid';

  ctx.font = '80px monospace';

  init(ctx);
}

export function update(dt: number) {
  const action = scene.current.update(dt);

  if (action === Actions.SET_TO_PLAY) {
    scene.current = play(Mode.NORMAL);
  }

  if (action === Actions.SET_TO_FAST_PLAY) {
    scene.current = play(Mode.FAST);
  }

  if (action === Actions.SET_TO_MENU) {
    scene.current = menu();
  }
}

export function draw(ctx: CanvasRenderingContext2D) {
  scene.current.draw(ctx);
}
