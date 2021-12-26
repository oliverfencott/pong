import { draw, load, update } from './src/game';
import './style.css';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

let prev = 0;

function loop(dt: number) {
  update(dt - prev);
  draw(ctx);

  prev = dt;

  window.requestAnimationFrame(loop);
}

load(ctx);
window.requestAnimationFrame(loop);
