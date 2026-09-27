import * as THREE from 'three';
import { inked, makePlant, toon } from '../world3d/models';

/**
 * room.js — the shop: floor, walls, counter, door and decoration.
 *
 * Layout (x right, z towards the camera):
 *   z ≈ -4.6  back wall, fruit crates in front of it
 *   z ≈  2.3  the counter; the player works behind it (north)
 *   z ≈  3.4  customers queue in front of it (south)
 *   customers walk in along the pavement from the right and leave the same way
 */

function tileTexture(a, b, size = 8) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const s = 256 / 2;
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      x.fillStyle = (i + j) % 2 ? a : b;
      x.fillRect(i * s, j * s, s, s);
    }
  }
  x.strokeStyle = 'rgba(58,51,87,.08)';
  x.lineWidth = 4;
  x.strokeRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(size, size);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  return t;
}

export function buildRoom(scene) {
  const room = new THREE.Group();
  scene.add(room);

  // Outside ground (grass) and pavement where the customers walk.
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshToonMaterial({ color: 0xa9dcb6 }));
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.01;
  grass.receiveShadow = true;
  room.add(grass);
  const pave = new THREE.Mesh(new THREE.PlaneGeometry(24, 3.6), new THREE.MeshToonMaterial({ map: tileTexture('#EDE4D6', '#E2D5C2', 1), color: 0xffffff }));
  pave.material.map.repeat.set(12, 2);
  pave.rotation.x = -Math.PI / 2;
  pave.position.set(2, 0, 4.4);
  pave.receiveShadow = true;
  room.add(pave);

  // Shop floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 8.6),
    new THREE.MeshToonMaterial({ map: tileTexture('#FBEBDD', '#F4DCC6', 1), color: 0xffffff })
  );
  floor.material.map.repeat.set(8, 4.3);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.005, -1.2);
  floor.receiveShadow = true;
  room.add(floor);

  // Rug
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40), toon(0xc9e6f5));
  rug.rotation.x = -Math.PI / 2;
  rug.scale.set(1.5, 1, 1);
  rug.position.set(0, 0.012, -0.9);
  rug.receiveShadow = true;
  room.add(rug);
  const rugRing = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.35, 40), toon(0x9fd0ea));
  rugRing.rotation.x = -Math.PI / 2;
  rugRing.scale.set(1.5, 1, 1);
  rugRing.position.set(0, 0.014, -0.9);
  room.add(rugRing);

  // Walls
  const wallMat = 0xffd6e8;
  const back = inked(new THREE.BoxGeometry(16.4, 2.2, 0.3), wallMat, 0.03);
  back.position.set(0, 1.1, -5.65);
  room.add(back);
  const trim = inked(new THREE.BoxGeometry(16.4, 0.18, 0.36), 0xff9cc8, 0);
  trim.position.set(0, 2.2, -5.65);
  room.add(trim);
  [-1, 1].forEach((s) => {
    const side = inked(new THREE.BoxGeometry(0.3, 2.2, 8.9), wallMat, 0.03);
    side.position.set(s * 8.2, 1.1, -1.2);
    room.add(side);
  });

  // Windows on the back wall
  [-5.2, 5.2].forEach((x) => {
    const w = inked(new THREE.BoxGeometry(2.2, 1.1, 0.05), 0xcfeaf7, 0.03);
    w.position.set(x, 1.35, -5.47);
    room.add(w);
    const bar = inked(new THREE.BoxGeometry(0.06, 1.1, 0.07), 0xffffff, 0);
    bar.position.set(x, 1.35, -5.44);
    room.add(bar);
  });

  // A sign on the back wall instead of an awning: an awning over the counter
  // hides the serving spot from the camera.
  const sign = inked(new THREE.BoxGeometry(3.2, 0.7, 0.08), 0xff6fb5, 0.03);
  sign.position.set(0, 1.75, -5.45);
  room.add(sign);
  [-1.1, 0, 1.1].forEach((x, i) => {
    const dot = inked(new THREE.SphereGeometry(0.16, 14, 10), [0xef5a5a, 0xf5c842, 0xff8a3d][i], 0.02);
    dot.position.set(x, 1.75, -5.38);
    room.add(dot);
  });

  // Counter
  const counter = inked(new THREE.BoxGeometry(7, 0.95, 0.95), 0xffb3d6, 0.045);
  counter.position.set(0, 0.475, 2.35);
  room.add(counter);
  const top = inked(new THREE.BoxGeometry(7.2, 0.12, 1.1), 0xfff4e6, 0.03);
  top.position.set(0, 1.0, 2.35);
  room.add(top);
  for (let i = 0; i < 7; i += 1) {
    const panel = inked(new THREE.BoxGeometry(0.7, 0.55, 0.03), 0xffd6e8, 0);
    panel.position.set(-3 + i, 0.48, 2.84);
    room.add(panel);
  }
  // Cash register
  const reg = inked(new THREE.BoxGeometry(0.7, 0.4, 0.5), 0x4fc3e8, 0.035);
  reg.position.set(3, 1.26, 2.3);
  reg.rotation.x = -0.2;
  room.add(reg);

  // Plants
  [[-7.4, -4.9, 1.2], [7.4, -4.9, 1.2], [-7.4, 1.6, 1], [-4.6, 4.2, 1.1], [5.5, 5.4, 1.2]].forEach(([x, z, s]) => {
    const p = makePlant(s);
    p.position.set(x, 0, z);
    room.add(p);
  });

  // A bench outside for atmosphere
  const bench = inked(new THREE.BoxGeometry(1.8, 0.14, 0.5), 0xd4a373, 0.03);
  bench.position.set(-2.4, 0.45, 5.6);
  room.add(bench);
  [-0.7, 0.7].forEach((dx) => {
    const leg = inked(new THREE.BoxGeometry(0.12, 0.45, 0.4), 0xb98a63, 0.02);
    leg.position.set(-2.4 + dx, 0.22, 5.6);
    room.add(leg);
  });

  return room;
}
