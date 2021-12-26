import { COLOR, HEIGHT, WIDTH } from './constants';
import { Actions } from './enums';
import { controls } from './input';

export default function () {
  return { update, draw };

  function update(_dt: number): Actions | void {
    if (controls.keyPressed.p) {
      return Actions.SET_TO_PLAY;
    }

    if (controls.keyPressed.f) {
      return Actions.SET_TO_FAST_PLAY;
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = COLOR;
    ctx.fillText('p = play', 100, HEIGHT * 0.7);
    ctx.fillText('f = fast', 100, HEIGHT * 0.9);
    ctx.restore();
  }
}
