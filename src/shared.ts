export function clamp(min: number, max: number, x: number) {
  return Math.max(min, Math.min(max, x));
}

export type vec2 = {
  x: number;
  y: number;
};

export const vec2 = (x: number, y: number): vec2 => ({ x, y });

export function isColliding(
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

export function pointIntersectsRect(point: vec2, position: vec2, size: vec2) {
  return (
    point.x > position.x &&
    point.y > position.y &&
    point.x < position.x + size.x &&
    point.y < position.y + size.y
  );
}
