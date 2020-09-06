/**
 * requestAnimationFrame polyfill
 */

let prev = Date.now();

function fallback(fn) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

const root = window;

const iRaf = root.requestAnimationFrame || fallback;

const iCancel = root.cancelAnimationFrame || root.clearTimeout;

export function raf(fn) {
  return iRaf.call(root, fn);
}

export function cancelRaf(id) {
  iCancel.call(root, id);
}
