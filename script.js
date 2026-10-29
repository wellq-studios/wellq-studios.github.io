// game.js is loaded first by the ordered deferred scripts in index.html.
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); nav.classList.remove('open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('info@wellq.io'); status.textContent = 'Copied. See you in our inbox!'; }
  catch { status.textContent = 'info@wellq.io'; }
});
const game = new CatGame();
const grid = document.querySelector('#cats');
const message = document.querySelector('#game-message');
const result = document.querySelector('#toy-result');
const counter = document.querySelector('#counter');
const instruction = document.querySelector('#game-instruction');
let advanceTimer;
const colors = ['#493b2b', '#715165', '#3e7254', '#a05a35', '#436e7d'];
const differences = ['winking', 'surprised', 'sleepy', 'looking left', 'smiling'];
function catSvg(odd, round) {
  const color = colors[round];
  const normal = '<ellipse cx="35" cy="48" rx="11" ry="14" fill="#fffaf0"/><ellipse cx="66" cy="45" rx="11" ry="14" fill="#fffaf0"/><ellipse cx="39" cy="49" rx="3" ry="6"/><ellipse cx="70" cy="46" rx="3" ry="6"/>';
  let eyes = normal;
  let mouth = '';
  if (odd && round === 0) eyes = '<path d="m25 48q9-12 20-1" fill="none" stroke="#fffaf0" stroke-width="4" stroke-linecap="round"/><ellipse cx="66" cy="45" rx="11" ry="14" fill="#fffaf0"/><ellipse cx="70" cy="46" rx="3" ry="6"/>';
  if (odd && round === 1) mouth = '<ellipse cx="52" cy="77" rx="6" ry="8" fill="#fffaf0"/>';
  if (odd && round === 2) eyes = '<path d="M24 46q11 12 22 0m9-3q11 12 22 0" fill="none" stroke="#fffaf0" stroke-width="4" stroke-linecap="round"/>';
  if (odd && round === 3) eyes = '<ellipse cx="35" cy="48" rx="11" ry="14" fill="#fffaf0"/><ellipse cx="66" cy="45" rx="11" ry="14" fill="#fffaf0"/><ellipse cx="30" cy="49" rx="3" ry="6"/><ellipse cx="61" cy="46" rx="3" ry="6"/>';
  if (odd && round === 4) mouth = '<path d="M35 72q16 22 32-2Z" fill="#fffaf0"/>';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="${color}"><path d="m18 40-4-29 25 18 23-2L86 9l-5 34q14 29-5 40-29 16-54-2Q4 67 18 40Z"/>${eyes}<path d="m46 64 11-2-5 9Z" fill="#e88542"/>${mouth}<path d="m17 64-16-4m18 12L3 76m77-14 18-7m-17 15 17 2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></g></svg>`;
}
function render(focusBoard = false) {
  counter.textContent = `${game.complete ? 5 : game.round + 1} / 5`;
  result.hidden = !game.complete;
  grid.hidden = game.complete;
  if (game.complete) {
    instruction.textContent = 'You spotted every curious cat.';
    message.textContent = 'A perfect little five.';
    document.querySelector('#again').focus({ preventScroll: true });
    return;
  }
  grid.replaceChildren();
  instruction.textContent = 'One cat is different. Give it a tap.';
  for (let i = 0; i < 9; i++) {
    const button = document.createElement('button');
    const odd = i === game.target;
    button.className = 'cat-button';
    button.type = 'button';
    button.setAttribute('aria-label', `Cat ${i + 1}: ${odd ? differences[game.round] : 'wide eyes looking right'}`);
    button.innerHTML = catSvg(odd, game.round);
    button.addEventListener('click', () => choose(i, button));
    grid.append(button);
  }
  if (focusBoard) grid.firstElementChild.focus({ preventScroll: true });
}
function choose(index, button) {
  const outcome = game.pick(index);
  if (outcome === 'ignored') return;
  if (outcome === 'miss') {
    button.classList.add('missed');
    message.textContent = 'Not that one. Take another peek.';
    return;
  }
  button.classList.add('found');
  message.textContent = ['That’s the one!', 'Sharp eyes!', 'You found the sleepy one.', 'Looking good!', 'Five out of five!'][game.round];
  const keyboard = button.matches(':focus-visible');
  advanceTimer = setTimeout(() => { game.advance(); render(keyboard); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 800 : 650);
}
function restart(focusBoard) {
  clearTimeout(advanceTimer);
  game.restart();
  message.textContent = 'A fresh start. Find the curious cat.';
  render(focusBoard);
}
document.querySelector('#reset').addEventListener('click', () => restart(false));
document.querySelector('#again').addEventListener('click', () => restart(true));
render();
