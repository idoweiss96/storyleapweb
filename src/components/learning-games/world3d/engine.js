import * as THREE from 'three';
import { basic, makeArrow, makeCharacter, makeRing } from './models';
import { Input } from './input';

/**
 * engine.js — the shared 3D world every learning game runs in.
 *
 * A game extends World and fills in four hooks:
 *   build()          add the scene: floor, props, NPCs, pads
 *   tick(dt, t)      game rules, called every frame while running
 *   hint()           the one-line instruction shown at the bottom
 *   snapshot()       extra state React needs for bubbles and HUD
 *
 * The engine owns everything that is the same in every game: renderer and
 * light, the player and how they walk, the follow camera, trigger pads, NPCs
 * that walk paths, tweens, particle bursts, the guide arrow, and gluing React
 * overlay elements (`data-anchor`) to 3D positions.
 *
 * No React inside the loop. State goes out through onState(snapshot) when it
 * changes; floating numbers through onPop.
 */

export const up = new THREE.Vector3(0, 1, 0);
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const distXZ = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
export const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

const DEFAULTS = {
  sky: 0xcfeffc,
  speed: 4.6,
  bounds: { minX: -7.5, maxX: 7.5, minZ: -4, maxZ: 4 },
  start: [0, 0, 0],
  player: { species: 'topi', apron: 0x4fc3e8, hat: 'chef' },
  camera: {
    fov: 38, narrowFov: 50,
    offset: [0, 11.5, 9.2], narrowOffset: [0, 13.5, 9.5],
    clampX: [-2.5, 2.5], narrowClampX: [-4.2, 4.2],
    clampZ: [-2, 2], lead: 0.6, narrowLead: 1.0,
  },
};

export class World {
  constructor({ mount, overlay, level, lang = 'he', copy, onState, onPop, config = {} }) {
    this.mount = mount;
    this.overlay = overlay;
    this.level = level;
    this.lang = lang;
    this.copy = copy;
    this.onState = onState;
    this.onPop = onPop;
    this.cfg = {
      ...DEFAULTS,
      ...config,
      camera: { ...DEFAULTS.camera, ...(config.camera || {}) },
      player: { ...DEFAULTS.player, ...(config.player || {}) },
    };
    this.running = false;
    this.done = false;
    this.time = 0;
    this.tweens = [];
    this.particles = [];
    this.pads = [];
    this.npcs = [];
    this.colliders = []; // { pos, r } circles the player cannot walk into
    this.guide = null; // Vector3 the arrow points at, or null
    this.flash = null;
    this.lastHint = '';
    this.frozen = false; // true while a cut-scene plays (player can't move)

    this.initRenderer();
    this.initPlayer();
    this.build();
    this.input = new Input(this.renderer.domElement, overlay);
    this.clock = new THREE.Clock();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
    if (typeof window !== 'undefined' && window.__LG_DEBUG) window.__world = this;
    this.emit();
  }

  /* ---------------- hooks (override) ---------------- */
  build() {}
  tick() {}
  hint() { return ''; }
  snapshot() { return {}; }
  anchor() { return null; } // (id) => Vector3 | null, for custom overlay anchors

  /* ---------------- setup ---------------- */
  initRenderer() {
    const r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.domElement.tabIndex = 0;
    r.domElement.className = 'w3-canvas';
    this.mount.appendChild(r.domElement);
    this.renderer = r;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.cfg.sky);
    this.scene.fog = new THREE.Fog(this.cfg.sky, 30, 60);
    this.camera = new THREE.PerspectiveCamera(this.cfg.camera.fov, 1, 0.1, 150);

    this.hemi = new THREE.HemisphereLight(0xffffff, 0xf0dcc8, 1.7);
    this.scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
    sun.position.set(6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 14, bottom: -14, far: 50 });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
    this.scene.add(sun);
    this.scene.add(sun.target);
    this.sun = sun;

    this.resize = () => {
      const w = this.mount.clientWidth;
      const h = this.mount.clientHeight;
      if (!w || !h) return;
      r.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.size = { w, h };
    };
    this.size = { w: 1, h: 1 };
    this.resize();
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(this.mount);
  }

  initPlayer() {
    const { species, apron, hat } = this.cfg.player;
    this.player = makeCharacter(species, { apron, hat });
    this.p = this.player.root.position;
    this.p.set(...this.cfg.start);
    this.player.root.rotation.y = Math.PI;
    this.scene.add(this.player.root);
    this.vel = new THREE.Vector3();
    this.carrying = false;
    this.playerMood = 'idle';

    this.arrow = makeArrow();
    this.arrow.visible = false;
    this.scene.add(this.arrow);

    this.camTarget = this.p.clone();
  }

  /* ---------------- public API for games ---------------- */
  start() {
    this.running = true;
    this.renderer.domElement.focus({ preventScroll: true });
    this.onStart?.();
    this.emit();
  }

  finish() {
    if (this.done) return;
    this.done = true;
    this.burst(this.p.clone().setY(2));
    this.emit();
  }

  emit() {
    this.onState?.({
      running: this.running,
      done: this.done,
      message: this.message(),
      ...this.snapshot(),
    });
  }

  say(text, secs = 2.6) {
    this.flash = { text, until: this.time + secs };
    this.emit();
  }

  message() {
    if (this.flash && this.time < this.flash.until) return this.flash.text;
    return this.running ? this.hint() : '';
  }

  /** Floating text over a 3D point ("3!", "+4"). */
  pop(text, world, kind = '') {
    const v = world.clone().project(this.camera);
    this.onPop?.({ text, kind, x: ((v.x + 1) / 2) * this.size.w, y: ((1 - v.y) / 2) * this.size.h });
  }

  /** Move `obj` to `to` (Vector3 or () => Vector3) along an arc. */
  tween(obj, to, { dur = 0.45, arc = 1, spin = true, onDone, from } = {}) {
    this.tweens.push({ obj, from: (from || obj.position).clone(), to, dur, arc, spin, t: 0, onDone });
  }

  /** Run fn(k) for k from 0 to 1 over `dur` seconds (scales, fades, pops). */
  animateValue(dur, fn, onDone) {
    this.tweens.push({ fn, dur, t: 0, onDone });
  }

  burst(pos, colors = [0xff6fb5, 0x4fc3e8, 0xf5c842, 0x5bc98c], count = 14) {
    for (let i = 0; i < count; i += 1) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), basic(colors[i % colors.length], { transparent: true }));
      m.position.copy(pos);
      const a = (i / count) * Math.PI * 2;
      m.userData.v = new THREE.Vector3(Math.cos(a) * 2.2, 3 + Math.random() * 2, Math.sin(a) * 2.2);
      m.userData.life = 0.9;
      this.scene.add(m);
      this.particles.push(m);
    }
  }

  /**
   * A trigger zone on the floor. The player standing on it calls onStay(dt)
   * every frame; onEnter/onLeave fire on the edges. `every` turns onStay into
   * a repeating action (one fruit, one drum beat) with that period.
   *
   * `dwell` (seconds) delays onEnter until the player has actually stopped
   * there: running across a pad on the way to another one must not count.
   * Games with pads side by side (boxes, crates, musicians) rely on it.
   */
  pad({ pos, r = 0.9, color = 0x4fc3e8, onEnter, onStay, onLeave, every = 0, dwell = 0, visible = true, enabled = true }) {
    const ring = makeRing(color, r);
    ring.position.set(pos.x, 0.02, pos.z);
    ring.visible = visible;
    this.scene.add(ring);
    const pad = { pos: pos.clone(), r, ring, onEnter, onStay, onLeave, every, dwell, enabled, inside: false, acc: 0, hold: 0, armed: false };
    this.pads.push(pad);
    return pad;
  }

  removePad(pad) {
    this.scene.remove(pad.ring);
    this.pads.splice(this.pads.indexOf(pad), 1);
  }

  /** An NPC character. `walk(points, onArrive)` sends it along a path. */
  npc(species, { at = V(), face = 0, hat = null, apron = null, speed = 2.6 } = {}) {
    const ch = makeCharacter(species, { hat, apron });
    ch.root.position.copy(at);
    ch.root.rotation.y = face;
    this.scene.add(ch.root);
    const n = {
      char: ch, root: ch.root, pos: ch.root.position, path: [], speed, mood: 'idle', moving: false, face,
      seed: Math.random() * 10,
      walk: (points, onArrive) => { n.path = points.map((q) => q.clone()); n.onArrive = onArrive; },
      remove: () => { this.scene.remove(ch.root); this.npcs.splice(this.npcs.indexOf(n), 1); },
    };
    this.npcs.push(n);
    return n;
  }

  collide(pos, r) {
    this.colliders.push({ pos: pos.clone(), r });
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.input.dispose();
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material?.map) o.material.map.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* ---------------- loop ---------------- */
  loop() {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.time += dt;
    this.step(dt);
    this.renderer.render(this.scene, this.camera);
    this.placeOverlay();
  }

  step(dt) {
    const t = this.time;
    const p = this.p;
    const live = this.running && !this.done;

    // Player movement
    const d = live && !this.frozen ? this.input.dir : { x: 0, y: 0 };
    const want = new THREE.Vector3(d.x, 0, d.y).multiplyScalar(this.cfg.speed);
    this.vel.lerp(want, 1 - Math.exp(-dt * 14));
    p.addScaledVector(this.vel, dt);
    const b = this.cfg.bounds;
    p.x = THREE.MathUtils.clamp(p.x, b.minX, b.maxX);
    p.z = THREE.MathUtils.clamp(p.z, b.minZ, b.maxZ);
    for (const c of this.colliders) {
      const dx = p.x - c.pos.x;
      const dz = p.z - c.pos.z;
      const dist = Math.hypot(dx, dz);
      const min = c.r + 0.35;
      if (dist < min && dist > 1e-4) {
        p.x = c.pos.x + (dx / dist) * min;
        p.z = c.pos.z + (dz / dist) * min;
      }
    }
    const speed = this.vel.length();
    if (speed > 0.4) this.player.root.rotation.y = lerpAngle(this.player.root.rotation.y, Math.atan2(this.vel.x, this.vel.z), 1 - Math.exp(-dt * 12));
    this.player.animate(t, dt, { moving: speed > 0.5, carrying: this.carrying, mood: this.done ? 'happy' : this.playerMood });

    // Pads
    if (live) {
      for (const pad of [...this.pads]) {
        const inside = pad.enabled && distXZ(p, pad.pos) < pad.r;
        if (inside && !pad.inside) {
          pad.inside = true;
          pad.acc = pad.every ? pad.every * 0.8 : 0;
          pad.hold = 0;
          pad.armed = !pad.dwell;
          if (!pad.dwell) pad.onEnter?.(pad);
        } else if (!inside && pad.inside) {
          pad.inside = false;
          pad.armed = false;
          pad.onLeave?.(pad);
        }
        if (inside && !pad.armed) {
          // Standing still on it (not just passing through) arms the pad.
          pad.hold += speed < 1.2 ? dt : 0;
          if (pad.hold >= pad.dwell) {
            pad.armed = true;
            pad.onEnter?.(pad);
          }
        }
        if (inside && pad.onStay) {
          if (pad.every) {
            pad.acc += dt;
            if (pad.acc >= pad.every) {
              pad.acc = 0;
              pad.onStay(pad);
            }
          } else pad.onStay(pad, dt);
        }
        if (pad.ring.visible && pad.ring.userData.fill) {
          pad.ring.userData.fill.material.opacity = inside ? 0.5 : 0.18 + Math.sin(t * 3 + pad.pos.x) * 0.06;
        }
      }
      this.tick(dt, t);
    }

    // NPCs
    for (const n of [...this.npcs]) {
      n.moving = false;
      if (n.path.length) {
        const target = n.path[0];
        const dir = target.clone().sub(n.pos).setY(0);
        const len = dir.length();
        if (len < 0.08) {
          n.path.shift();
          if (!n.path.length) {
            n.root.rotation.y = n.face;
            const cb = n.onArrive;
            n.onArrive = null;
            cb?.(n);
          }
        } else {
          dir.normalize();
          n.pos.addScaledVector(dir, Math.min(len, n.speed * dt));
          n.root.rotation.y = lerpAngle(n.root.rotation.y, Math.atan2(dir.x, dir.z), 0.2);
          n.moving = true;
        }
      }
      if (n.lift !== undefined) n.root.position.y = n.lift;
      n.char.animate(t + n.seed, dt, { moving: n.moving, mood: n.mood, carrying: n.carrying });
    }

    // Tweens
    for (const tw of [...this.tweens]) {
      tw.t += dt / tw.dur;
      const k = Math.min(1, tw.t);
      if (tw.fn) tw.fn(k);
      else {
        const to = typeof tw.to === 'function' ? tw.to() : tw.to;
        tw.obj.position.lerpVectors(tw.from, to, ease(k)).addScaledVector(up, tw.arc * 4 * k * (1 - k));
        if (tw.spin) tw.obj.rotation.y += dt * 8;
      }
      if (k >= 1) {
        this.tweens.splice(this.tweens.indexOf(tw), 1);
        tw.onDone?.();
      }
    }

    // Particles
    for (const m of [...this.particles]) {
      m.userData.life -= dt;
      m.userData.v.y -= 9 * dt;
      m.position.addScaledVector(m.userData.v, dt);
      m.material.opacity = Math.max(0, m.userData.life / 0.9);
      if (m.userData.life <= 0) {
        this.scene.remove(m);
        this.particles.splice(this.particles.indexOf(m), 1);
      }
    }

    // Guide arrow
    const g = live ? this.guide : null;
    if (g && distXZ(p, g) > 1.1) {
      this.arrow.visible = true;
      this.arrow.position.set(g.x, (g.y || 0) + 1.2 + Math.sin(t * 5) * 0.18, g.z);
      this.arrow.rotation.y += dt * 2;
    } else this.arrow.visible = false;

    const hint = this.message();
    if (hint !== this.lastHint) {
      this.lastHint = hint;
      this.emit();
    }

    // Camera
    const cam = this.cfg.camera;
    const narrow = this.camera.aspect < 0.9;
    const fov = narrow ? cam.narrowFov : cam.fov;
    if (this.camera.fov !== fov) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
    const cx = narrow ? cam.narrowClampX : cam.clampX;
    const focus = this.camFocus || p;
    this.camTarget.lerp(
      V(THREE.MathUtils.clamp(focus.x, cx[0], cx[1]), 0, THREE.MathUtils.clamp(focus.z, cam.clampZ[0], cam.clampZ[1]) + (narrow ? cam.narrowLead : cam.lead)),
      1 - Math.exp(-dt * 4)
    );
    const off = narrow ? cam.narrowOffset : cam.offset;
    this.camera.position.set(this.camTarget.x + off[0], off[1], this.camTarget.z + off[2]);
    this.camera.lookAt(this.camTarget.x, 0.4, this.camTarget.z);
    // Keep the shadow camera centred on the action in big worlds.
    this.sun.position.set(this.camTarget.x + 6, 14, this.camTarget.z + 8);
    this.sun.target.position.set(this.camTarget.x, 0, this.camTarget.z);
  }

  /** Keep every React overlay element glued to its 3D owner. */
  placeOverlay() {
    this.overlay.querySelectorAll('[data-anchor]').forEach((el) => {
      const id = el.getAttribute('data-anchor');
      const world = id === 'player' ? this.p.clone().add(V(0, 2.65, 0)) : this.anchor(id);
      if (!world) return;
      const v = world.clone().project(this.camera);
      // Keep the whole element on screen, by its real width (bubbles vary).
      const half = Math.min((el.firstElementChild?.offsetWidth || 120) / 2 + 8, this.size.w / 2);
      const x = THREE.MathUtils.clamp(((v.x + 1) / 2) * this.size.w, half, this.size.w - half);
      const y = THREE.MathUtils.clamp(((1 - v.y) / 2) * this.size.h, 110, this.size.h - 60);
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    });
  }
}
