// petTalkDog3D — פוצי, כלבלבה תלת-ממדית (three.js), מצוירת בסגנון cartoon.
//
//   const dog = mountDog3D(el, { controller, onPress });
//   dog.destroy();
//
// התצוגה קוראת בכל פריים את controller.state ואת controller.level():
//   idle       נושמת, ממצמצת, מכשכשת בזנב, הראש עוקב אחרי העכבר/האצבע
//   listening  אוזניים זקופות, ראש מוטה, טבעת סגולה שגדלה עם הקול של הילד
//   thinking   ראש מוטה לצד השני, עיניים למעלה, שלוש נקודות מעל הראש
//   speaking   הפה נפתח לפי עוצמת הקול, הראש מהנהן, הזנב מכשכש מהר
// לחיצה על הכלבה (raycast) קוראת ל-onPress, עם קפיצה קטנה.

import * as THREE from 'three';

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const COLORS = {
  fur: 0xf4a95a, furDark: 0xd9823b, belly: 0xffe3c2, ink: 0x3b2a20, white: 0xffffff,
  cheek: 0xff9aa2, mouth: 0x7a2e2e, tongue: 0xff8a8a, collar: 0x7c5cff, tag: 0xffc94d, dots: 0x9b87ff,
};

export function mountDog3D(el, { controller, onPress = () => {} } = {}) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const disposables = [];
  const keep = (x) => (disposables.push(x), x);

  // ── במה ──────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:manipulation;cursor:pointer';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 1.8, 6.6);
  camera.lookAt(0, 1.42, 0);

  scene.add(new THREE.HemisphereLight(0xfff4e6, 0xc9b8ff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2.5, 5, 4);
  scene.add(key);

  // 3 גוונים קשים = מראה מצויר
  const gradient = keep(new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat));
  gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  const toon = (color, extra = {}) => keep(new THREE.MeshToonMaterial({ color, gradientMap: gradient, ...extra }));
  const outlineMat = keep(new THREE.MeshBasicMaterial({ color: 0x5a3a24, side: THREE.BackSide }));

  const sphere = keep(new THREE.SphereGeometry(1, 40, 28));
  const M = {
    fur: toon(COLORS.fur), furDark: toon(COLORS.furDark), belly: toon(COLORS.belly), white: toon(COLORS.white),
    ink: keep(new THREE.MeshStandardMaterial({ color: COLORS.ink, roughness: 0.25, metalness: 0.1 })),
    mouth: toon(COLORS.mouth), tongue: toon(COLORS.tongue), collar: toon(COLORS.collar), tag: toon(COLORS.tag),
    cheek: keep(new THREE.MeshBasicMaterial({ color: COLORS.cheek, transparent: true, opacity: 0.55 })),
    dots: keep(new THREE.MeshBasicMaterial({ color: COLORS.dots })),
  };

  function blob(parent, mat, pos, scale, { outline = false, rot } = {}) {
    const m = new THREE.Mesh(sphere, mat);
    m.position.set(...pos);
    m.scale.set(...scale);
    if (rot) m.rotation.set(...rot);
    parent.add(m);
    if (outline) {
      // "גוף הפוך" מעט גדול יותר = קו מתאר מצויר
      const o = new THREE.Mesh(sphere, outlineMat);
      o.position.copy(m.position);
      o.scale.set(scale[0] * 1.045, scale[1] * 1.045, scale[2] * 1.045);
      if (rot) o.rotation.copy(m.rotation);
      parent.add(o);
    }
    return m;
  }

  // ── הכלבה ────────────────────────────────────────────────
  const dog = new THREE.Group();
  scene.add(dog);

  // צל רך
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const sg = shadowCanvas.getContext('2d');
  const grad = sg.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(60,40,30,0.35)');
  grad.addColorStop(1, 'rgba(60,40,30,0)');
  sg.fillStyle = grad;
  sg.fillRect(0, 0, 128, 128);
  const shadowTex = keep(new THREE.CanvasTexture(shadowCanvas));
  const shadow = new THREE.Mesh(keep(new THREE.PlaneGeometry(2.8, 2.8)), keep(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  scene.add(shadow);

  // טבעת הקשבה
  const ring = new THREE.Mesh(keep(new THREE.TorusGeometry(1.25, 0.05, 12, 64)), keep(new THREE.MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0 })));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  scene.add(ring);

  const body = new THREE.Group();
  dog.add(body);
  blob(body, M.fur, [0, 0.85, 0], [0.78, 0.7, 0.72], { outline: true });
  blob(body, M.belly, [0, 0.78, 0.42], [0.46, 0.48, 0.32]);
  // רגליים
  for (const x of [-0.3, 0.3]) {
    blob(body, M.fur, [x, 0.36, 0.38], [0.17, 0.3, 0.17], { outline: true });
    blob(body, M.furDark, [x, 0.08, 0.48], [0.2, 0.12, 0.24], { outline: true });
  }
  for (const x of [-0.55, 0.55]) {
    blob(body, M.fur, [x, 0.4, -0.18], [0.3, 0.32, 0.38], { outline: true });
    blob(body, M.furDark, [x * 0.95, 0.08, 0.02], [0.2, 0.11, 0.26], { outline: true });
  }
  // קולר עם תג
  const collar = new THREE.Mesh(keep(new THREE.TorusGeometry(0.46, 0.07, 12, 40)), M.collar);
  collar.position.set(0, 1.24, 0.06);
  collar.rotation.x = Math.PI / 2 - 0.25;
  body.add(collar);
  const tag = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 24)), M.tag);
  tag.position.set(0, 1.06, 0.52);
  tag.rotation.x = Math.PI / 2 - 0.2;
  body.add(tag);
  // זנב
  const tail = new THREE.Group();
  tail.position.set(0, 1.0, -0.62);
  body.add(tail);
  blob(tail, M.furDark, [0, 0.28, -0.12], [0.11, 0.32, 0.11], { outline: true, rot: [-0.5, 0, 0] });

  // ראש
  const head = new THREE.Group();
  head.position.set(0, 1.6, 0.08);
  dog.add(head);
  blob(head, M.fur, [0, 0.48, 0], [0.86, 0.8, 0.78], { outline: true });
  blob(head, M.belly, [0, 0.26, 0.58], [0.42, 0.3, 0.3]);
  blob(head, M.ink, [0, 0.4, 0.86], [0.13, 0.1, 0.09]);
  // תלתל
  blob(head, M.furDark, [0, 1.23, 0.1], [0.14, 0.12, 0.14]);
  blob(head, M.furDark, [0.13, 1.19, 0.08], [0.11, 0.1, 0.11]);
  blob(head, M.furDark, [-0.13, 1.19, 0.08], [0.11, 0.1, 0.11]);
  // לחיים
  for (const x of [-0.46, 0.46]) blob(head, M.cheek, [x, 0.28, 0.58], [0.13, 0.08, 0.04]);
  // עיניים
  const eyes = [];
  const pupils = [];
  for (const x of [-0.28, 0.28]) {
    const eye = new THREE.Group();
    eye.position.set(x, 0.6, 0.67);
    head.add(eye);
    blob(eye, M.white, [0, 0, 0], [0.17, 0.21, 0.1]);
    const pupil = new THREE.Group();
    eye.add(pupil);
    blob(pupil, M.ink, [0, -0.02, 0.07], [0.1, 0.12, 0.05]);
    blob(pupil, M.white, [0.035, 0.03, 0.11], [0.032, 0.032, 0.02]);
    eyes.push(eye);
    pupils.push(pupil);
  }
  // פה: קו חיוך כשסגור, פתוח עם לשון כשמדברת
  const mouth = new THREE.Group();
  mouth.position.set(0, 0.17, 0.83);
  head.add(mouth);
  const mouthInside = blob(mouth, M.mouth, [0, 0, 0], [0.16, 0.12, 0.06]);
  const tongue = blob(mouth, M.tongue, [0, -0.06, 0.03], [0.09, 0.05, 0.04]);
  // אוזניים מתנפנפות
  const ears = [];
  for (const side of [-1, 1]) {
    const ear = new THREE.Group();
    ear.position.set(side * 0.62, 0.95, -0.02);
    head.add(ear);
    blob(ear, M.furDark, [side * 0.16, -0.42, 0], [0.26, 0.56, 0.13], { outline: true, rot: [0, 0, side * 0.28] });
    ears.push({ ear, side });
  }
  // נקודות חשיבה
  const dots = new THREE.Group();
  dots.position.set(0.7, 2.75, 0.3);
  scene.add(dots);
  const dotMeshes = [0, 1, 2].map((i) => {
    const d = new THREE.Mesh(sphere, M.dots);
    d.scale.setScalar(0.07 + i * 0.02);
    d.position.set(i * 0.22, i * 0.2, 0);
    dots.add(d);
    return d;
  });

  // ── קלט ──────────────────────────────────────────────────
  const pointer = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  let bounceStart = -1;

  function toNdc(e) {
    const r = renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }
  function hitDog(ndc) {
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObject(dog, true).length > 0;
  }
  const onMove = (e) => {
    const p = toNdc(e);
    pointer.copy(p);
    renderer.domElement.style.cursor = hitDog(p) ? 'pointer' : 'default';
  };
  const onDown = (e) => {
    if (!hitDog(toNdc(e))) return;
    bounceStart = performance.now();
    onPress();
  };
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerdown', onDown);

  // ── גודל ─────────────────────────────────────────────────
  function resize() {
    const w = Math.max(1, el.clientWidth);
    const h = Math.max(1, el.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // מסך צר (טלפון): מתרחקים קצת כדי שהכלבה תיכנס כולה
    camera.position.z = camera.aspect < 0.8 ? 7.6 : 6.4;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  // ── אנימציה ──────────────────────────────────────────────
  const clock = new THREE.Clock();
  const cur = { earLift: 0, tilt: 0, lookUp: 0, nod: 0, mouth: 0, ring: 0, dots: 0 };
  let nextBlink = 1.5;
  let blinkUntil = -1;
  let raf = 0;
  let destroyed = false;
  const approach = (k, target, dt, speed = 8) => { cur[k] += (target - cur[k]) * (1 - Math.exp(-dt * speed)); };

  function frame() {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const state = controller?.state || 'idle';
    const level = controller?.level?.() || 0;
    const amp = reduced ? 0.2 : 1;

    const target = {
      earLift: state === 'listening' ? 1 : 0,
      tilt: state === 'listening' ? 0.2 : state === 'thinking' ? -0.22 : 0,
      lookUp: state === 'thinking' ? 1 : 0,
      nod: state === 'speaking' ? level : 0,
      mouth: state === 'speaking' ? (level > 0.05 ? 0.25 + level * 0.9 : 0.12) : 0,
      ring: state === 'listening' ? 0.35 + level * 0.65 : 0,
      dots: state === 'thinking' ? 1 : 0,
    };
    for (const k of Object.keys(target)) approach(k, target[k], dt, k === 'mouth' ? 22 : 8);

    // נשימה
    body.scale.y = 1 + Math.sin(t * 2.2) * 0.018 * amp;
    head.position.y = 1.6 + Math.sin(t * 2.2 - 0.6) * 0.025 * amp;

    // ראש: עוקב אחרי המצביע, מוטה בהקשבה/חשיבה, מהנהן בדיבור
    const follow = state === 'idle' || state === 'listening' ? 1 : 0.3;
    head.rotation.y += (pointer.x * 0.38 * follow - head.rotation.y) * (1 - Math.exp(-dt * 5));
    head.rotation.x = -pointer.y * 0.12 * follow - cur.lookUp * 0.14 + Math.sin(t * 9) * cur.nod * 0.07 * amp;
    head.rotation.z = cur.tilt + Math.sin(t * 1.3) * 0.03 * amp;

    // עיניים: מצמוץ, ובחשיבה מבט למעלה
    if (t > nextBlink) { blinkUntil = t + 0.13; nextBlink = t + 2.4 + Math.random() * 3.2; }
    const blink = t < blinkUntil ? 0.08 : 1;
    for (const e of eyes) e.scale.y = blink;
    for (const p of pupils) p.position.set(pointer.x * 0.03 * follow, cur.lookUp * 0.06 + pointer.y * 0.02 * follow, 0);

    // אוזניים: מתנפנפות, זקופות בהקשבה
    for (const { ear, side } of ears) {
      // בהקשבה האוזניים נפתחות הצידה ולמעלה ("אוזניים זקופות") — כך הן נשארות גלויות
      ear.rotation.z = side * (cur.earLift * 0.6 + Math.sin(t * 2.7 + side) * 0.05 * amp);
      ear.rotation.x = -cur.earLift * 0.2;
    }

    // זנב: מהר יותר כשמדברת או מקשיבה
    const wag = state === 'speaking' ? 11 : state === 'listening' ? 8 : 4.5;
    tail.rotation.y = Math.sin(t * wag) * (state === 'thinking' ? 0.15 : 0.45) * amp;
    tail.rotation.x = -0.15;

    // פה
    mouthInside.scale.set(0.15, 0.028 + cur.mouth * 0.12, 0.05);
    tongue.visible = cur.mouth > 0.2;
    tongue.position.y = -0.03 - cur.mouth * 0.05;

    // טבעת הקשבה ונקודות חשיבה
    ring.material.opacity = cur.ring * 0.8;
    ring.scale.setScalar(0.9 + cur.ring * 0.25);
    dots.visible = cur.dots > 0.05;
    dotMeshes.forEach((d, i) => { d.position.y = i * 0.2 + Math.sin(t * 4 + i * 0.8) * 0.06 * amp; d.scale.setScalar((0.07 + i * 0.02) * cur.dots); });

    // קפיצה קטנה בלחיצה
    const b = bounceStart < 0 ? 1 : (performance.now() - bounceStart) / 420;
    dog.position.y = b < 1 ? Math.sin(b * Math.PI) * 0.22 * amp : 0;
    shadow.scale.setScalar(1 - dog.position.y * 0.6);

    renderer.render(scene, camera);
  }
  frame();

  return {
    // לבדיקות: מצב הגוף כרגע
    debug: () => ({
      state: controller?.state || 'idle', mouth: cur.mouth, earLift: cur.earLift, dotsVisible: dots.visible,
      ring: ring.material.opacity, headTilt: head.rotation.z, jump: dog.position.y,
    }),
    // לבדיקות: נקודה על המסך (0..1) שנמצאת על הכלבה
    dogScreenPoint() {
      const v = new THREE.Vector3(0, 1.95, 0.4).project(camera);
      return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
