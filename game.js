// Classic script so direct file previews work without module CORS restrictions.
class CatGame {
  constructor(random = Math.random) { this.random = random; this.restart(); }
  restart() { this.round = 0; this.complete = false; this.locked = false; this.nextTarget(); }
  nextTarget() { this.target = Math.min(8, Math.max(0, Math.floor(this.random() * 9))); }
  pick(index) {
    if (this.complete || this.locked || !Number.isInteger(index) || index < 0 || index > 8) return 'ignored';
    if (index !== this.target) return 'miss';
    this.locked = true;
    return 'found';
  }
  advance() {
    if (!this.locked || this.complete) return;
    this.round += 1;
    if (this.round === 5) { this.complete = true; return; }
    this.locked = false;
    this.nextTarget();
  }
}
