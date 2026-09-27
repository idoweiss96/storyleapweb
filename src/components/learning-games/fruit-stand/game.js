import * as THREE from 'three';
import {
  FRUIT_HEIGHT, basic, inked, makeArrow, makeCharacter, makeCoin, makeCrate, makeFruit, makeLabel, makeRing,
} from '../world3d/models';
import { buildRoom } from './room';
import { Input } from '../world3d/input';
import { chime, fanfare, hmm, speak, tone } from '../shared/sound';
import { CUSTOMERS_PER_ROUND, CUSTOMER_SPECIES, FRUITS, MAX_CARRY, STATIONS, UI } from './fruitStandContent';

/**
 * game.js — the fruit stand simulation. Plain JS, no React inside the loop.
 *
 * React owns the overlay content (order bubbles, HUD); this class owns the 3D
 * world and, every frame, moves overlay elements marked `data-anchor` to the
 * screen position of the thing they belong to. Logical changes are pushed out
 * through `onState(snapshot)`; one-off floating numbers through `onPop`.
 */

const SPEED = 4.6;
const BOUNDS = { minX: -7.5, maxX: 7.5, minZ: -3.75, maxZ: 1.5 };
const PAD_Z = -3.15;
const CRATE_Z = -4.55;
const TRASH = new THREE.Vector3(-6.7, 0, 0.5);
const STREET_Z = 4.45;
const ENTRY_X = 13;
const PICK_EVERY = 0.62;
const GIVE_EVERY = 0.28;

const up = new THREE.Vector3(0, 1, 0);
const distXZ = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export class Game {
  constructor({ mount, overlay, level, lang = 'he', onState, onPop }) {
    this.mount = mount;
    this.overlay = overlay;
    this.level = level;
    this.lang = lang;
    this.copy = UI[lang] || UI.he;
    this.onState = onState;
    this.onPop = onPop;
    this.running = false;
    this.done = false;
    this.time = 0;
    this.coins = 0;
    this.earned = 0;
    this.served = 0;
    this.spawned = 0;
    this.stack = [];
    this.customers = [];
    this.tweens = [];
    this.particles = [];
    this.nextId = 1;
    this.spawnT = 0.8;
    this.pickT = 0;
    this.giveT = 0;
    this.trashT = 0;
    this.unlockT = 0;
    this.flash = null; // { text, until }
    this.lastHint = '';
    this.lastSpecies = null;

    this.initRenderer();
    this.initWorld();
    this.input = new Input(this.renderer.domElement, overlay);
    this.clock = new THREE.Clock();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
    // Test harness hook; never set on the site.
    if (typeof window !== 'undefined' && window.__LG_DEBUG) window.__fruitStand = this;
    this.emit();
  }

  /* ------------------------------------------------------------------ */
  initRenderer() {
    const r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.domElement.tabIndex = 0;
    r.domElement.className = 'fs-canvas';
    this.mount.appendChild(r.domElement);
    this.renderer = r;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcfeffc);
    this.scene.fog = new THREE.Fog(0xcfeffc, 26, 48);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xf0dcc8, 1.7);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
    sun.position.set(6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -14;
    sc.right = 14;
    sc.top = 12;
    sc.bottom = -12;
    sc.far = 40;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
    this.scene.add(sun);

    this.resize = () => {
      const w = this.mount.clientWidth;
      const h = this.mount.clientHeight;
      if (!w || !h) return;
      r.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.size = { w, h };
    };
    this.resize();
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(this.mount);
  }

  initWorld() {
    buildRoom(this.scene);

    this.stations = STATIONS.map((s) => {
      const st = { ...s, pos: new THREE.Vector3(s.x, 0, PAD_Z), unlocked: s.price === 0, paid: 0 };
      st.crate = makeCrate(s.type);
      st.crate.position.set(s.x, 0, CRATE_Z);
      this.scene.add(st.crate);
      st.pad = makeRing(0x4fc3e8, 0.9);
      st.pad.position.set(s.x, 0.02, PAD_Z);
      this.scene.add(st.pad);
      if (!st.unlocked) {
        st.crate.visible = false;
        st.pad.visible = false;
        st.ghost = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1), basic(0xffffff, { transparent: true, opacity: 0.45 }));
        st.ghost.position.set(s.x, 0.3, CRATE_Z);
        this.scene.add(st.ghost);
        st.lock = makeRing(0xf5c842, 0.9);
        st.lock.position.set(s.x, 0.02, PAD_Z);
        this.scene.add(st.lock);
        st.label = makeLabel(String(s.price), { coin: true, w: 1.5 });
        st.label.position.set(s.x, 1.35, PAD_Z);
        this.scene.add(st.label);
        const preview = makeFruit(s.type);
        preview.position.set(s.x, 0.95, CRATE_Z);
        preview.scale.setScalar(1.6);
        st.preview = preview;
        this.scene.add(preview);
      }
      return st;
    });

    // Return basket for extra fruit.
    this.basket = inked(new THREE.CylinderGeometry(0.5, 0.4, 0.55, 18), 0xd9a56e, 0.04);
    this.basket.position.set(TRASH.x - 0.9, 0.28, TRASH.z);
    this.scene.add(this.basket);
    const trashPad = makeRing(0xff9cc8, 0.75);
    trashPad.position.copy(TRASH).setY(0.02);
    this.scene.add(trashPad);
    this.trashPad = trashPad;

    // Customer spots at the counter, and the matching serving spots behind it.
    const slotXs = this.level.mode === 'count' ? [0] : [-1.8, 1.8];
    this.slots = slotXs.map((x) => {
      const deliver = new THREE.Vector3(x, 0, 1.05);
      const pad = makeRing(0x5bc98c, 0.85);
      pad.position.copy(deliver).setY(0.02);
      this.scene.add(pad);
      return { x, z: 3.35, deliver, pad, customer: null };
    });

    // The player: Topi, in an apron and chef's hat.
    this.player = makeCharacter('topi', { apron: 0x4fc3e8, hat: 'chef' });
    this.player.root.position.set(0, 0, -0.6);
    this.player.root.rotation.y = Math.PI;
    this.scene.add(this.player.root);
    this.vel = new THREE.Vector3();
    this.stackAnchor = new THREE.Group();
    this.stackAnchor.position.set(0, 0.92, 0.48);
    this.player.root.add(this.stackAnchor);

    this.arrow = makeArrow();
    this.arrow.visible = false;
    this.scene.add(this.arrow);

    this.camTarget = new THREE.Vector3(0, 0, 0);
    this.camera.position.set(0, 12, 10);
  }

  /* ------------------------------------------------------------------ */
  start() {
    this.running = true;
    this.renderer.domElement.focus({ preventScroll: true });
    this.emit();
  }

  peek(id) {
    const c = this.customers.find((x) => x.id === id);
    if (!c) return;
    c.hidden = false;
    c.hideAt = this.time + 2.2;
    this.emit();
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

  /* ------------------------------------------------------------------ */
  emit() {
    const counts = {};
    this.stack.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });
    this.onState?.({
      running: this.running,
      done: this.done,
      coins: this.coins,
      earned: this.earned,
      served: this.served,
      total: CUSTOMERS_PER_ROUND,
      carrying: counts,
      message: this.message(),
      customers: this.customers
        .filter((c) => c.state === 'wait' || c.state === 'happy')
        .map((c) => ({ id: c.id, order: c.order, got: { ...c.got }, hidden: c.hidden, happy: c.state === 'happy' })),
    });
  }

  say(text, secs = 2.6) {
    this.flash = { text, until: this.time + secs };
    this.emit();
  }

  fruitName(type, n = 2) {
    const f = FRUITS[type];
    if (this.lang === 'he') return n === 1 ? f.heOne : f.he;
    return n === 1 ? f.enOne : f.en;
  }

  /* What should the child do next? Drives both the arrow and the hint line. */
  plan() {
    const p = this.player.root.position;
    const waiting = this.slots.map((s) => s.customer).filter((c) => c && c.state === 'wait');
    const counts = {};
    this.stack.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });
    for (const c of waiting) {
      const need = Object.entries(c.order).map(([type, n]) => ({ type, left: n - (c.got[type] || 0) })).filter((x) => x.left > 0);
      if (!need.length) continue;
      const short = need.find((x) => (counts[x.type] || 0) < x.left);
      const neededTypes = new Set(need.map((x) => x.type));
      const junk = this.stack.some((s) => !neededTypes.has(s.type)) && !this.stack.some((s) => neededTypes.has(s.type));
      if (junk) return { target: TRASH, hint: this.copy.trash };
      if (short) {
        const st = this.stations.find((s) => s.type === short.type);
        const onIt = distXZ(p, st.pos) < 0.95;
        return { target: st.pos, hint: onIt ? this.copy.picking : this.copy.goPick.replace('{fruit}', this.fruitName(short.type)) };
      }
      const first = need[0];
      return {
        target: c.slot.deliver,
        hint: this.copy.goServe.replace('{n}', counts[first.type]).replace('{fruit}', this.fruitName(first.type, counts[first.type])),
      };
    }
    const affordable = this.stations.find((s) => !s.unlocked && this.coins >= s.price - s.paid);
    if (affordable) return { target: affordable.pos, hint: this.copy.unlockHint };
    if (this.stack.length && !waiting.length) return { target: TRASH, hint: this.copy.trash };
    return { target: null, hint: this.copy.howTo };
  }

  message() {
    if (this.flash && this.time < this.flash.until) return this.flash.text;
    return this.running ? this.plan().hint : this.copy.howTo;
  }

  /* ------------------------------------------------------------------ */
  makeOrder() {
    const open = this.stations.filter((s) => s.unlocked).map((s) => s.type);
    const { mode, max } = this.level;
    const early = this.spawned < 2;
    const n = () => rand(1, early ? Math.min(3, max) : max);
    if (mode === 'count' || open.length < 2) {
      const type = open[Math.floor(Math.random() * open.length)];
      return { [type]: mode === 'count' ? n() : rand(2, max + 1) };
    }
    const [a, b] = open.sort(() => Math.random() - 0.5);
    return { [a]: rand(1, early ? 2 : max), [b]: rand(1, early ? 2 : max) };
  }

  spawnCustomer(slot) {
    let species;
    do species = CUSTOMER_SPECIES[Math.floor(Math.random() * CUSTOMER_SPECIES.length)];
    while (species === this.lastSpecies);
    this.lastSpecies = species;
    const ch = makeCharacter(species);
    ch.root.position.set(ENTRY_X, 0, STREET_Z);
    this.scene.add(ch.root);
    const c = {
      id: this.nextId++,
      char: ch,
      slot,
      state: 'enter',
      path: [new THREE.Vector3(slot.x, 0, STREET_Z), new THREE.Vector3(slot.x, 0, slot.z)],
      order: this.makeOrder(),
      got: {},
      hidden: false,
      hideAt: Infinity,
      moving: false,
    };
    slot.customer = c;
    this.customers.push(c);
    this.spawned += 1;
  }

  /* ------------------------------------------------------------------ */
  tween(obj, to, { dur = 0.45, arc = 1, onDone, from } = {}) {
    this.tweens.push({ obj, from: (from || obj.position).clone(), to, dur, arc, t: 0, onDone });
  }

  burst(pos, colors = [0xff6fb5, 0x4fc3e8, 0xf5c842, 0x5bc98c]) {
    for (let i = 0; i < 14; i += 1) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), basic(colors[i % colors.length], { transparent: true }));
      m.position.copy(pos);
      const a = (i / 14) * Math.PI * 2;
      m.userData.v = new THREE.Vector3(Math.cos(a) * 2.2, 3 + Math.random() * 2, Math.sin(a) * 2.2);
      m.userData.life = 0.9;
      this.scene.add(m);
      this.particles.push(m);
    }
  }

  stackTop() {
    return this.stack.reduce((h, s) => h + FRUIT_HEIGHT[s.type] * 0.9, 0);
  }

  layoutStack() {
    let y = 0;
    this.stack.forEach((s, i) => {
      if (s.flying) return;
      s.mesh.position.set(((i % 2) - 0.5) * 0.05, y + 0.1, 0);
      y += FRUIT_HEIGHT[s.type] * 0.9;
    });
  }

  pop(text, world, kind = '') {
    const v = world.clone().project(this.camera);
    this.onPop?.({ text, kind, x: ((v.x + 1) / 2) * this.size.w, y: ((1 - v.y) / 2) * this.size.h });
  }

  pick(st) {
    if (this.stack.length >= MAX_CARRY) {
      if (!this.flash || this.time > this.flash.until) this.say(this.copy.full, 1.6);
      return;
    }
    const mesh = makeFruit(st.type);
    const start = new THREE.Vector3(st.x + (Math.random() - 0.5) * 0.5, 0.85, CRATE_Z);
    mesh.position.copy(start);
    this.scene.add(mesh);
    const item = { type: st.type, mesh, flying: true };
    const y = this.stackTop();
    this.stack.push(item);
    const n = this.stack.filter((s) => s.type === st.type).length;
    this.tween(mesh, () => this.stackAnchor.localToWorld(new THREE.Vector3(0, y + 0.1, 0)), {
      dur: 0.32,
      arc: 0.9,
      onDone: () => {
        item.flying = false;
        this.stackAnchor.add(mesh);
        this.layoutStack();
      },
    });
    // The number is the point of the game: shown, voiced, and heard as pitch.
    tone(262 * 2 ** (Math.min(n, 12) / 8), { dur: 0.22 });
    speak(n, this.lang, { rate: 1.05 });
    this.pop(String(n), this.player.root.position.clone().add(new THREE.Vector3(0, 2.55, 0)), 'count');
    this.emit();
  }

  give(c) {
    const needed = Object.entries(c.order).filter(([t, n]) => (c.got[t] || 0) < n).map(([t]) => t);
    let idx = -1;
    for (let i = this.stack.length - 1; i >= 0; i -= 1) {
      if (!this.stack[i].flying && needed.includes(this.stack[i].type)) { idx = i; break; }
    }
    if (idx < 0) {
      if (this.stack.length && (!this.flash || this.time > this.flash.until)) {
        hmm();
        this.say(this.copy.wrongFruit.replace('{fruit}', this.fruitName(needed[0])), 2);
      }
      return;
    }
    const [item] = this.stack.splice(idx, 1);
    const wp = new THREE.Vector3();
    item.mesh.getWorldPosition(wp);
    this.scene.add(item.mesh);
    item.mesh.position.copy(wp);
    this.layoutStack();
    c.got[item.type] = (c.got[item.type] || 0) + 1;
    const target = c.char.root.position.clone().add(new THREE.Vector3(0, 1.0, 0.2));
    this.tween(item.mesh, target, { dur: 0.3, arc: 0.7, onDone: () => this.scene.remove(item.mesh) });
    tone(523, { dur: 0.12, type: 'sine', gain: 0.1 });
    const done = Object.entries(c.order).every(([t, n]) => (c.got[t] || 0) >= n);
    if (done) this.serve(c);
    this.emit();
  }

  serve(c) {
    c.state = 'happy';
    c.happyT = 1.7;
    c.hidden = false;
    this.served += 1;
    chime();
    const total = Object.values(c.order).reduce((a, b) => a + b, 0);
    const reward = total + 1;
    const head = c.char.root.position.clone().add(new THREE.Vector3(0, 1.8, 0));
    this.burst(head);
    // Coins pop out onto the counter, then fly into the player's pocket.
    for (let i = 0; i < reward; i += 1) {
      const coin = makeCoin();
      const from = new THREE.Vector3(c.slot.x + (Math.random() - 0.5) * 1.2, 1.15, 2.3);
      coin.position.copy(from);
      this.scene.add(coin);
      setTimeout(() => {
        if (this.disposed) return;
        this.tween(coin, () => this.player.root.position.clone().add(new THREE.Vector3(0, 1.2, 0)), {
          dur: 0.45,
          arc: 1.4,
          onDone: () => {
            this.scene.remove(coin);
            this.coins += 1;
            this.earned += 1;
            tone(880 + (i % 4) * 110, { dur: 0.08, type: 'sine', gain: 0.07 });
            this.emit();
          },
        });
      }, 250 + i * 70);
    }
    const extra = Object.keys(c.order).find((t) => this.stack.some((s) => s.type === t));
    if (extra) {
      // Say how many are left over: that number is the counting lesson.
      const left = this.stack.filter((s) => s.type === extra).length;
      const text = left === 1 ? this.copy.tooManyOne : this.copy.tooMany;
      this.say(text.replace('{need}', c.order[extra]).replace('{extra}', left).replace('{fruit}', this.fruitName(extra, left)), 3.4);
    } else {
      this.say(this.copy.thanks, 2);
    }
  }

  unlock(st) {
    st.unlocked = true;
    this.scene.remove(st.lock, st.label, st.ghost, st.preview);
    st.crate.visible = true;
    st.pad.visible = true;
    st.crate.scale.setScalar(0.01);
    st.popT = 0;
    this.burst(new THREE.Vector3(st.x, 1, CRATE_Z));
    fanfare();
    this.say(this.copy.unlocked.replace('{fruit}', this.fruitName(st.type)), 3);
  }

  /* ------------------------------------------------------------------ */
  loop() {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.time += dt;
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
    this.placeOverlay();
  }

  update(dt) {
    const t = this.time;
    const p = this.player.root.position;

    /* ---- player movement ---- */
    const d = this.running && !this.done ? this.input.dir : { x: 0, y: 0, len: 0 };
    const want = new THREE.Vector3(d.x, 0, d.y).multiplyScalar(SPEED);
    this.vel.lerp(want, 1 - Math.exp(-dt * 14));
    p.addScaledVector(this.vel, dt);
    p.x = THREE.MathUtils.clamp(p.x, BOUNDS.minX, BOUNDS.maxX);
    p.z = THREE.MathUtils.clamp(p.z, BOUNDS.minZ, BOUNDS.maxZ);
    const speed = this.vel.length();
    if (speed > 0.4) this.player.root.rotation.y = lerpAngle(this.player.root.rotation.y, Math.atan2(this.vel.x, this.vel.z), 1 - Math.exp(-dt * 12));
    this.player.animate(t, dt, { moving: speed > 0.5, carrying: this.stack.length > 0, mood: this.done ? 'happy' : 'idle' });

    if (this.running && !this.done) {
      /* ---- crates ---- */
      const st = this.stations.find((s) => s.unlocked && distXZ(p, s.pos) < 0.95);
      if (st) {
        if (this.atStation !== st) {
          this.atStation = st;
          this.pickT = PICK_EVERY - 0.12;
          this.emit();
        }
        this.pickT += dt;
        if (this.pickT >= PICK_EVERY) {
          this.pickT = 0;
          this.pick(st);
        }
      } else if (this.atStation) {
        this.atStation = null;
        this.emit();
      }

      /* ---- serving ---- */
      const slot = this.slots.find((s) => s.customer?.state === 'wait' && distXZ(p, s.deliver) < 1.0);
      if (slot) {
        this.giveT += dt;
        if (this.giveT >= GIVE_EVERY) {
          this.giveT = 0;
          this.give(slot.customer);
        }
      } else this.giveT = GIVE_EVERY - 0.1;

      /* ---- return basket ---- */
      if (distXZ(p, TRASH) < 0.85 && this.stack.length) {
        this.trashT += dt;
        if (this.trashT > 0.18) {
          this.trashT = 0;
          const item = this.stack.pop();
          const wp = new THREE.Vector3();
          item.mesh.getWorldPosition(wp);
          this.scene.add(item.mesh);
          item.mesh.position.copy(wp);
          this.tween(item.mesh, this.basket.position.clone().add(up.clone().multiplyScalar(0.3)), { dur: 0.3, onDone: () => this.scene.remove(item.mesh) });
          tone(330, { dur: 0.08, type: 'sine', gain: 0.07 });
          this.emit();
        }
      }

      /* ---- unlock pads ---- */
      const lockSt = this.stations.find((s) => !s.unlocked && distXZ(p, s.pos) < 0.95);
      if (lockSt && this.coins > 0) {
        this.unlockT += dt;
        if (this.unlockT > 0.09) {
          this.unlockT = 0;
          this.coins -= 1;
          lockSt.paid += 1;
          const coin = makeCoin();
          coin.position.copy(p).setY(1.2);
          this.scene.add(coin);
          this.tween(coin, lockSt.pos.clone().setY(0.2), { dur: 0.3, arc: 1, onDone: () => this.scene.remove(coin) });
          tone(700 + lockSt.paid * 20, { dur: 0.06, type: 'sine', gain: 0.06 });
          lockSt.label.userData.redraw(String(lockSt.price - lockSt.paid));
          if (lockSt.paid >= lockSt.price) this.unlock(lockSt);
          this.emit();
        }
      }

      /* ---- customers arriving ---- */
      this.spawnT -= dt;
      const active = this.customers.filter((c) => c.state !== 'leave').length;
      const free = this.slots.find((s) => !s.customer);
      if (free && this.spawnT <= 0 && this.spawned < CUSTOMERS_PER_ROUND && active < this.slots.length) {
        this.spawnCustomer(free);
        this.spawnT = 2.4;
      }
    }

    /* ---- customers ---- */
    for (const c of [...this.customers]) {
      const pos = c.char.root.position;
      c.moving = false;
      if (c.path.length) {
        const target = c.path[0];
        const dir = target.clone().sub(pos).setY(0);
        const len = dir.length();
        if (len < 0.08) {
          c.path.shift();
          if (!c.path.length && c.state === 'enter') {
            c.state = 'wait';
            c.char.root.rotation.y = Math.PI;
            if (this.level.mode === 'memory') c.hideAt = this.time + 4;
            this.emit();
            if (this.level.mode === 'memory') this.say(this.copy.memoryHide, 3);
          }
          if (!c.path.length && c.state === 'leave') {
            this.scene.remove(c.char.root);
            this.customers.splice(this.customers.indexOf(c), 1);
            continue;
          }
        } else {
          dir.normalize();
          pos.addScaledVector(dir, Math.min(len, 2.6 * dt));
          c.char.root.rotation.y = lerpAngle(c.char.root.rotation.y, Math.atan2(dir.x, dir.z), 0.2);
          c.moving = true;
        }
      }
      if (c.state === 'wait' && !c.hidden && this.time > c.hideAt) {
        c.hidden = true;
        this.emit();
      }
      if (c.state === 'happy') {
        c.happyT -= dt;
        if (c.happyT <= 0) {
          c.state = 'leave';
          c.slot.customer = null;
          c.path = [new THREE.Vector3(c.slot.x, 0, STREET_Z), new THREE.Vector3(ENTRY_X + 2, 0, STREET_Z)];
          this.emit();
        }
      }
      c.char.animate(t + c.id, dt, { moving: c.moving, mood: c.state === 'happy' ? 'happy' : c.state === 'wait' ? 'think' : 'idle' });
    }

    /* ---- round over ---- */
    if (this.running && !this.done && this.served >= CUSTOMERS_PER_ROUND && !this.customers.some((c) => c.state !== 'leave')) {
      this.done = true;
      fanfare();
      this.burst(p.clone().setY(2));
      this.emit();
    }

    /* ---- tweens ---- */
    for (const tw of [...this.tweens]) {
      tw.t += dt / tw.dur;
      const k = Math.min(1, tw.t);
      const to = typeof tw.to === 'function' ? tw.to() : tw.to;
      tw.obj.position.lerpVectors(tw.from, to, ease(k)).addScaledVector(up, tw.arc * 4 * k * (1 - k));
      tw.obj.rotation.y += dt * 8;
      if (k >= 1) {
        this.tweens.splice(this.tweens.indexOf(tw), 1);
        tw.onDone?.();
      }
    }

    /* ---- particles ---- */
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

    /* ---- unlocked crates pop in; pads pulse ---- */
    this.stations.forEach((s) => {
      if (s.popT !== undefined && s.popT < 1) {
        s.popT = Math.min(1, s.popT + dt * 2.2);
        const k = s.popT;
        s.crate.scale.setScalar(Math.max(0.01, 1 - (1 - k) ** 3 + Math.sin(k * Math.PI) * 0.2));
      }
      const active = distXZ(p, s.pos) < 0.95;
      const ring = s.unlocked ? s.pad : s.lock;
      if (ring) ring.userData.fill.material.opacity = active ? 0.5 : 0.18 + Math.sin(t * 3) * 0.06;
      if (s.label) s.label.position.y = 1.35 + Math.sin(t * 2.5) * 0.06;
      if (s.preview) s.preview.rotation.y += dt;
    });
    this.slots.forEach((s) => {
      const on = s.customer?.state === 'wait';
      s.pad.visible = on;
      if (on) s.pad.userData.fill.material.opacity = distXZ(p, s.deliver) < 1 ? 0.5 : 0.2 + Math.sin(t * 4) * 0.08;
    });
    this.trashPad.userData.fill.material.opacity = this.stack.length ? 0.28 : 0.12;

    /* ---- guide arrow ---- */
    const plan = this.running && !this.done ? this.plan() : { target: null };
    if (plan.target && distXZ(p, plan.target) > 1.1) {
      this.arrow.visible = true;
      this.arrow.position.set(plan.target.x, 1.2 + Math.sin(t * 5) * 0.18, plan.target.z);
      this.arrow.rotation.y += dt * 2;
    } else this.arrow.visible = false;
    const hint = this.message();
    if (hint !== this.lastHint) {
      this.lastHint = hint;
      this.emit();
    }

    /* ---- camera ---- */
    const narrow = this.camera.aspect < 0.9;
    // Portrait phones get a wider lens so the counter and the queue stay in shot.
    const fov = narrow ? 50 : 38;
    if (this.camera.fov !== fov) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
    this.camTarget.lerp(
      new THREE.Vector3(THREE.MathUtils.clamp(p.x, narrow ? -4.2 : -2.5, narrow ? 4.2 : 2.5), 0, THREE.MathUtils.clamp(p.z, -2, 0.8) + (narrow ? 1.0 : 0.6)),
      1 - Math.exp(-dt * 4)
    );
    const off = narrow ? new THREE.Vector3(0, 13.5, 9.5) : new THREE.Vector3(0, 11.5, 9.2);
    this.camera.position.copy(this.camTarget).add(off);
    this.camera.lookAt(this.camTarget.clone().add(new THREE.Vector3(0, 0.4, 0)));
  }

  /** Keep every React overlay element glued to its 3D owner. */
  placeOverlay() {
    const els = this.overlay.querySelectorAll('[data-anchor]');
    els.forEach((el) => {
      const id = el.getAttribute('data-anchor');
      let world = null;
      if (id === 'player') world = this.player.root.position.clone().add(new THREE.Vector3(0, 2.65 + this.stackTop() * 0.3, 0));
      else {
        const c = this.customers.find((x) => `c${x.id}` === id);
        if (c) world = c.char.root.position.clone().add(new THREE.Vector3(0, 2.35, 0));
      }
      if (!world) return;
      const v = world.project(this.camera);
      const x = ((v.x + 1) / 2) * this.size.w;
      const y = ((1 - v.y) / 2) * this.size.h;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    });
  }
}
