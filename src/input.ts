export const controls = {
  up: false,
  down: false,
  w: false,
  s: false
};

export function init() {
  window.addEventListener('keydown', event => {
    if (event.code === 'KeyW') {
      event.preventDefault();
      controls.w = true;
    }

    if (event.code === 'KeyS') {
      event.preventDefault();
      controls.s = true;
    }

    if (event.code === 'ArrowUp') {
      event.preventDefault();
      controls.up = true;
    }

    if (event.code === 'ArrowDown') {
      event.preventDefault();
      controls.down = true;
    }
  });

  window.addEventListener('keyup', event => {
    if (event.code === 'KeyW') {
      controls.w = false;
    }

    if (event.code === 'KeyS') {
      controls.s = false;
    }

    if (event.code === 'ArrowUp') {
      controls.up = false;
    }

    if (event.code === 'ArrowDown') {
      controls.down = false;
    }
  });
}
