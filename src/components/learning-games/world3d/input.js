/**
 * input.js — a floating virtual joystick (touch or mouse) plus arrows/WASD.
 *
 * Put a finger anywhere on the play area and drag: the joystick appears under
 * the finger, the way mobile management games do it. `dir` is a unit-ish
 * vector in screen space (x right, y down); the game maps it onto the floor.
 */
export class Input {
  constructor(surface, overlay) {
    this.surface = surface;
    this.keys = new Set();
    this.stick = null; // { id, ox, oy, dx, dy }
    this.base = document.createElement('div');
    this.base.className = 'fs-stick';
    this.knob = document.createElement('div');
    this.knob.className = 'fs-knob';
    this.base.appendChild(this.knob);
    overlay.appendChild(this.base);
    this.moved = false;

    this.onDown = (e) => {
      if (e.target.closest('[data-ui]')) return;
      if (this.stick) return;
      surface.setPointerCapture?.(e.pointerId);
      const r = surface.getBoundingClientRect();
      this.stick = { id: e.pointerId, ox: e.clientX - r.left, oy: e.clientY - r.top, dx: 0, dy: 0 };
      this.base.style.transform = `translate(${this.stick.ox}px, ${this.stick.oy}px)`;
      this.base.classList.add('on');
      this.knob.style.transform = 'translate(-50%, -50%)';
    };
    this.onMove = (e) => {
      if (!this.stick || e.pointerId !== this.stick.id) return;
      const r = surface.getBoundingClientRect();
      let dx = e.clientX - r.left - this.stick.ox;
      let dy = e.clientY - r.top - this.stick.oy;
      const len = Math.hypot(dx, dy);
      const max = 46;
      if (len > max) {
        dx = (dx / len) * max;
        dy = (dy / len) * max;
      }
      this.stick.dx = dx / max;
      this.stick.dy = dy / max;
      if (len > 6) this.moved = true;
      this.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };
    this.onUp = (e) => {
      if (!this.stick || e.pointerId !== this.stick.id) return;
      this.stick = null;
      this.base.classList.remove('on');
    };
    this.onKey = (e) => {
      const k = e.key.toLowerCase();
      if (!['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) return;
      if (e.type === 'keydown') {
        this.keys.add(k);
        this.moved = true;
      } else this.keys.delete(k);
      e.preventDefault();
    };
    surface.addEventListener('pointerdown', this.onDown);
    surface.addEventListener('pointermove', this.onMove);
    surface.addEventListener('pointerup', this.onUp);
    surface.addEventListener('pointercancel', this.onUp);
    surface.addEventListener('keydown', this.onKey);
    surface.addEventListener('keyup', this.onKey);
  }

  get dir() {
    let x = 0;
    let y = 0;
    if (this.stick) {
      x = this.stick.dx;
      y = this.stick.dy;
    }
    const k = this.keys;
    if (k.has('arrowleft') || k.has('a')) x -= 1;
    if (k.has('arrowright') || k.has('d')) x += 1;
    if (k.has('arrowup') || k.has('w')) y -= 1;
    if (k.has('arrowdown') || k.has('s')) y += 1;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x, y, len: Math.min(1, len) };
  }

  dispose() {
    const s = this.surface;
    s.removeEventListener('pointerdown', this.onDown);
    s.removeEventListener('pointermove', this.onMove);
    s.removeEventListener('pointerup', this.onUp);
    s.removeEventListener('pointercancel', this.onUp);
    s.removeEventListener('keydown', this.onKey);
    s.removeEventListener('keyup', this.onKey);
    this.base.remove();
  }
}
