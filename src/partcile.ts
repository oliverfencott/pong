import { vec2 } from './shared';

export type particle = {
  position: vec2;
  size: vec2;
  dir: vec2;
  acc: vec2;
  opacity: number;

  r: number;
  g: number;
  b: number;
};

export const makeParticle = (
  position: vec2,
  dirX: number,
  dirY: number
): particle => ({
  position: vec2(position.x, position.y),
  size: vec2(4, 4),
  dir: vec2(dirX, dirY),
  acc: vec2(
    Math.random() * (Math.random() + 5),
    Math.random() * (Math.random() + 5)
  ),
  opacity: 1,
  r: Math.round(Math.random() * 256),
  g: Math.round(Math.random() * 256),
  b: Math.round(Math.random() * 256)
});
